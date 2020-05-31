import { injectable, inject } from 'tsyringe';
import path from 'path';

import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/container/Providers/MailProvider/models/IMailProvider';
import IUserRepository from '../repositories/IUserRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest {
	email: string;
}

@injectable()
class CreateUserService {
	constructor(
		@inject('UserRepository')
		private userRepository: IUserRepository,

		@inject('MailProvider')
		private mailProvider: IMailProvider,

		@inject('UserTokensRepository')
		private userTokensRepository: IUserTokensRepository,
	) {}

	public async execute({ email }: IRequest): Promise<void> {
		const user = await this.userRepository.findByEmail(email);

		if (!user) {
			throw new AppError('This email no exists.');
		}

		const { token } = await this.userTokensRepository.generate(user.id);

		const forgotPasswordTemplate = path.resolve(
			__dirname,
			'..',
			'templates',
			'forgot_password.hbs',
		);

		await this.mailProvider.sendMail({
			to: {
				name: user.name,
				email: user.email,
			},
			subject: '[GoBarber] Recuperação de senha',
			templateData: {
				file: forgotPasswordTemplate,
				variables: {
					name: user.name,
					token,
					link: `${process.env.APP_WEB_URL}/reset-password?token=${token}`,
				},
			},
		});
	}
}

export default CreateUserService;
