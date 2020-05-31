import { ObjectID } from 'mongodb';

import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';

class AppointmentsRepository implements INotificationRepository {
	private notificatinons: Notification[] = [];

	public async create({
		content,
		recipient_id,
	}: ICreateNotificationDTO): Promise<Notification> {
		const notification = new Notification();

		Object.assign(notification, { id: new ObjectID(), recipient_id, content });

		await this.notificatinons.push(notification);

		return notification;
	}
}

export default AppointmentsRepository;
