import FakeCacheProvider from '@shared/container/Providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import ListProvidersService from './ListProvidersService';

let fakeUserRepository: FakeUserRepository;
let listProvidersService: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('Show Profile', () => {
	beforeEach(() => {
		fakeUserRepository = new FakeUserRepository();
		fakeCacheProvider = new FakeCacheProvider();
		listProvidersService = new ListProvidersService(
			fakeUserRepository,
			fakeCacheProvider,
		);
	});

	it('should be able to list the providers', async () => {
		const user1 = await fakeUserRepository.create({
			name: 'John Doe',
			email: 'john@example.com',
			password: '123456',
		});

		const user2 = await fakeUserRepository.create({
			name: 'John Trê',
			email: 'johntre@example.com',
			password: '123456',
		});

		const loggedUser = await fakeUserRepository.create({
			name: 'John Qua',
			email: 'johnqua@example.com',
			password: '123456',
		});

		const providers = await listProvidersService.execute({
			user_id: loggedUser.id,
		});

		expect(providers).toEqual([user1, user2]);
	});
});
