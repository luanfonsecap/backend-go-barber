import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '../dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '../dtos/IFindAllInDayFromProviderDTO';

export default interface IAppointmentRepository {
	create(data: ICreateAppointmentDTO): Promise<Appointment>;
	findByDate(data: Date, provider_id: string): Promise<Appointment | undefined>;
	IFindAllInMonthFromProvider(
		data: IFindAllInMonthFromProviderDTO,
	): Promise<Appointment[]>;
	IFindAllInDayFromProvider(
		data: IFindAllInDayFromProviderDTO,
	): Promise<Appointment[]>;
}
