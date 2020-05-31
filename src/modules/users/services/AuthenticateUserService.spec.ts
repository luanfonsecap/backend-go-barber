import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let authenticateUserService: AuthenticateUserService;

describe('Authenticate User Service', () => {
	beforeEach(() => {
		fakeUserRepository = new FakeUserRepository();
		fakeHashProvider = new FakeHashProvider();

		authenticateUserService = new AuthenticateUserService(
			fakeUserRepository,
			fakeHashProvider,
		);
	});

	it('should be able to authenticate a valid user', async () => {
		const user = await fakeUserRepository.create({
			name: 'John Doe',
			email: 'john@example.com',
			password: '123456',
		});

		const authenticate = await authenticateUserService.execute({
			email: 'john@example.com',
			password: '123456',
		});

		await expect(authenticate).toHaveProperty('token');
		await expect(authenticate.user).toEqual(user);
	});

	it('should not be able to authenticate with non existing user', async () => {
		authenticateUserService.execute({
			email: 'john@example.com',
			password: '123456',
		});

		await expect(
			authenticateUserService.execute({
				email: 'john@example.com',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to authenticate with wrong password', async () => {
		await fakeUserRepository.create({
			name: 'John Doe',
			email: 'john@example.com',
			password: '123456',
		});

		await expect(
			authenticateUserService.execute({
				email: 'john@example.com',
				password: 'wrong-pasword',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
