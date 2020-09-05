import ICreateNotificationDTO from '../dtos/ICreateNotificationDTO';
import Notification from '../infra/schemas/Notification';

export default interface INotificationRepository {
	create(data: ICreateNotificationDTO): Promise<Notification>;
}
