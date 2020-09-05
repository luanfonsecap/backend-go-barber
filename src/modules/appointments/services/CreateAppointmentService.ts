import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICacheProvider from '@shared/container/Providers/CacheProvider/models/ICacheProvider';
import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';
import IAppointmentRepository from '../repositories/IAppointmentsRepository';

interface IRequestDTO {
	provider_id: string;
	user_id: string;
	date: Date;
}

@injectable()
class CreateAppointmentService {
	constructor(
		@inject('AppointmentsRepository')
		private appointmentRepository: IAppointmentRepository,

		@inject('NotificationRepository')
		private notificationsRepository: INotificationRepository,

		@inject('CacheProvider')
		private cacheProvider: ICacheProvider,
	) {}

	public async execute({
		date,
		user_id,
		provider_id,
	}: IRequestDTO): Promise<Appointment> {
		const appointmentDate = startOfHour(date);

		if (isBefore(appointmentDate, Date.now())) {
			throw new AppError(
				"It's not possible to create an appointment on a past date",
			);
		}

		if (user_id === provider_id) {
			throw new AppError(
				"It's not possible to create an appointment with the same user as provider",
			);
		}

		if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
			throw new AppError(
				"It's only possible to create an appointment between 8am and 5pm	",
			);
		}

		const findAppointmentInSameDate = await this.appointmentRepository.findByDate(
			appointmentDate,
			provider_id,
		);

		if (findAppointmentInSameDate) {
			throw new AppError('This appointment is already booked');
		}

		const appointment = await this.appointmentRepository.create({
			provider_id,
			user_id,
			date: appointmentDate,
		});

		const formattedDate = format(appointmentDate, "dd/MM/yyy 'ás' HH:mm'h'");

		await this.notificationsRepository.create({
			recipient_id: provider_id,
			content: `Novo agendamento para dia ${formattedDate}`,
		});

		await this.cacheProvider.invalidate(
			`provider-appointments:${provider_id}:${format(
				appointmentDate,
				'yyyy-M-d',
			)}`,
		);

		return appointment;
	}
}

export default CreateAppointmentService;
