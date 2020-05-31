import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/Providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('Create User', () => {
	beforeEach(() => {
		fakeUserRepository = new FakeUserRepository();
		fakeHashProvider = new FakeHashProvider();
		fakeCacheProvider = new FakeCacheProvider();

		createUserService = new CreateUserService(
			fakeUserRepository,
			fakeHashProvider,
			fakeCacheProvider,
		);
	});

	it('should be able to create a new user', async () => {
		const user = await createUserService.execute({
			name: 'John Doe',
			email: 'john@example.com',
			password: '123456',
		});

		await expect(user).toHaveProperty('id');
	});

	it('should not be able to create a user with repeated email', async () => {
		await createUserService.execute({
			name: 'John Doe',
			email: 'john@example.com',
			password: '123456',
		});

		await expect(
			createUserService.execute({
				name: 'John Doe',
				email: 'john@example.com',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
