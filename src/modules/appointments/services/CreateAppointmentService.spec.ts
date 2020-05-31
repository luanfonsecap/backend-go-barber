import AppError from '@shared/errors/AppError';

import FakeNotificationRepository from '@modules/notifications/repositories/fakes/FakeNotificationRepository';
import FakeCacheProvider from '@shared/container/Providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationRepository: FakeNotificationRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointmentService: CreateAppointmentService;

describe('Create Appointment', () => {
	beforeEach(() => {
		fakeAppointmentsRepository = new FakeAppointmentsRepository();
		fakeNotificationRepository = new FakeNotificationRepository();
		fakeCacheProvider = new FakeCacheProvider();

		createAppointmentService = new CreateAppointmentService(
			fakeAppointmentsRepository,
			fakeNotificationRepository,
			fakeCacheProvider,
		);
	});

	it('should be able to create a new appointment', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});

		const appointment = await createAppointmentService.execute({
			date: new Date(2020, 4, 10, 13),
			user_id: 'user-id',
			provider_id: 'provider-id',
		});

		await expect(appointment).toHaveProperty('id');
		await expect(appointment.provider_id).toBe('provider-id');
	});

	it('should not be able to create a new appointment in the same time', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});

		const appointmentDate = new Date(2020, 5, 11, 12);

		await createAppointmentService.execute({
			date: appointmentDate,
			provider_id: 'provider_id',
			user_id: 'user_id',
		});

		await expect(
			createAppointmentService.execute({
				date: appointmentDate,
				provider_id: 'provider_id',
				user_id: 'user2_id',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create an appointment in past date', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});

		await expect(
			createAppointmentService.execute({
				date: new Date(2020, 4, 10),
				user_id: 'user-id',
				provider_id: 'provider-id',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create an appointment with the same user as provider', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 9).getTime();
		});

		await expect(
			createAppointmentService.execute({
				date: new Date(2020, 4, 10, 10),
				user_id: 'same-id',
				provider_id: 'same-id',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create an appointment before 8am and after 5pm', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});

		await expect(
			createAppointmentService.execute({
				date: new Date(2020, 4, 11, 7),
				user_id: 'user-id',
				provider_id: 'provdider-id',
			}),
		).rejects.toBeInstanceOf(AppError);

		await expect(
			createAppointmentService.execute({
				date: new Date(2020, 4, 11, 18),
				user_id: 'user-id',
				provider_id: 'provdider-id',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
