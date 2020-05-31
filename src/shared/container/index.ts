import { container } from 'tsyringe';

import '@modules/users/providers';
import './Providers/index';

import AppointmentsRepository from '@modules/appointments/infra/repositories/AppointmentsRepository';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import UserRepository from '@modules/users/infra/repositories/UserRepository';
import IUserRepository from '@modules/users/repositories/IUserRepository';

import UserTokensRepository from '@modules/users/infra/repositories/UserTokensRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import NotificationRepository from '@modules/notifications/infra/typeorm/repositories/NotificationRepository';
import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';

container.registerSingleton<IAppointmentRepository>(
	'AppointmentsRepository',
	AppointmentsRepository,
);

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);

container.registerSingleton<IUserTokensRepository>(
	'UserTokensRepository',
	UserTokensRepository,
);

container.registerSingleton<INotificationRepository>(
	'NotificationRepository',
	NotificationRepository,
);
