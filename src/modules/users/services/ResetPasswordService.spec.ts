import AppError from '@shared/errors/AppError';

import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeUsersTokensRepository from '../repositories/fakes/FakeUsersTokensRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUserRepository: FakeUserRepository;
let fakeUsersTokensRepository: FakeUsersTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('Send Forgot Password Email', () => {
	beforeEach(() => {
		fakeUserRepository = new FakeUserRepository();
		fakeUsersTokensRepository = new FakeUsersTokensRepository();
		fakeHashProvider = new FakeHashProvider();

		resetPasswordService = new ResetPasswordService(
			fakeUserRepository,
			fakeUsersTokensRepository,
			fakeHashProvider,
		);
	});

	it('should be able to reset the password', async () => {
		const user = await fakeUserRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456',
		});

		const { token } = await fakeUsersTokensRepository.generate(user.id);

		const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

		await resetPasswordService.execute({
			password: '123123',
			token,
		});

		const updatedUser = await fakeUserRepository.findById(user.id);

		expect(generateHash).toHaveBeenCalledWith('123123');
		expect(updatedUser?.password).toBe('123123');
	});

	it('should not be able to reset the password with non-existing token', async () => {
		await expect(
			resetPasswordService.execute({
				token: 'non-existing-token',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to reset the password with non-existing user id', async () => {
		const { token } = await fakeUsersTokensRepository.generate(
			'non-existing-user-id',
		);

		await expect(
			resetPasswordService.execute({
				token,
				password: '123456',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to reset password if passed more than 2 hours', async () => {
		const user = await fakeUserRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456',
		});

		const { token } = await fakeUsersTokensRepository.generate(user.id);

		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			const customDate = new Date();

			return customDate.setHours(customDate.getHours() + 3);
		});

		await expect(
			resetPasswordService.execute({
				password: '123123',
				token,
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
