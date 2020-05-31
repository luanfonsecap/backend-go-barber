import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/container/Providers/MailProvider/fakes/FakeMailProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeUsersTokensRepository from '../repositories/fakes/FakeUsersTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUserRepository: FakeUserRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUsersTokensRepository: FakeUsersTokensRepository;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('Send Forgot Password Email', () => {
	beforeEach(() => {
		fakeUserRepository = new FakeUserRepository();
		fakeMailProvider = new FakeMailProvider();
		fakeUsersTokensRepository = new FakeUsersTokensRepository();

		sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
			fakeUserRepository,
			fakeMailProvider,
			fakeUsersTokensRepository,
		);
	});

	it('should be able to revocer the password using the email', async () => {
		const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

		await fakeUserRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456',
		});

		await sendForgotPasswordEmailService.execute({
			email: 'johndoe@example.com',
		});

		await expect(sendMail).toHaveBeenCalled();
	});

	it('should not be able to recover a non-existing user password', async () => {
		await expect(
			sendForgotPasswordEmailService.execute({
				email: 'johndoe@example.com',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('sould generate a forgot password token', async () => {
		const generateToken = jest.spyOn(fakeUsersTokensRepository, 'generate');

		const user = await fakeUserRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456',
		});

		await sendForgotPasswordEmailService.execute({
			email: 'johndoe@example.com',
		});

		await expect(generateToken).toHaveBeenCalledWith(user.id);
	});
});
