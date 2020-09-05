import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/Providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderAppointmentsService from './ListProviderAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let listProviderAppointmentsService: ListProviderAppointmentsService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('List Provider Appointment Service', () => {
	beforeEach(() => {
		fakeAppointmentsRepository = new FakeAppointmentsRepository();
		fakeCacheProvider = new FakeCacheProvider();

		listProviderAppointmentsService = new ListProviderAppointmentsService(
			fakeAppointmentsRepository,
			fakeCacheProvider,
		);
	});

	it('should be able to list the appointments on a specific day', async () => {
		const appointment1 = await fakeAppointmentsRepository.create({
			provider_id: 'provider',
			user_id: 'user',
			date: new Date(2020, 4, 20, 14, 0, 0),
		});

		const appointment2 = await fakeAppointmentsRepository.create({
			provider_id: 'provider',
			user_id: 'user',
			date: new Date(2020, 4, 20, 15, 0, 0),
		});

		const availability = await listProviderAppointmentsService.execute({
			provider_id: 'provider',
			day: 20,
			month: 5,
			year: 2020,
		});

		expect(availability).toEqual([appointment1, appointment2]);
	});
});
