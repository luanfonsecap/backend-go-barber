import { injectable, inject } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';

import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
	token: string;
	password: string;
}

@injectable()
class ResetPasswordService {
	constructor(
		@inject('UserRepository')
		private userRepository: IUserRepository,

		@inject('UserTokensRepository')
		private userTokensRepository: IUserTokensRepository,

		@inject('HashProvider')
		private hashProvider: IHashProvider,
	) {}

	public async execute({ token, password }: IRequest): Promise<void> {
		const userByToken = await this.userTokensRepository.findByToken(token);

		if (!userByToken) {
			throw new AppError('User token does not extits');
		}

		const user = await this.userRepository.findById(userByToken.user_id);

		if (!user) {
			throw new AppError('User does not extits');
		}

		const tokenCreatedAt = userByToken.created_at;
		const compareDate = addHours(tokenCreatedAt, 2);

		if (isAfter(Date.now(), compareDate)) {
			throw new AppError('Expired token');
		}

		user.password = await this.hashProvider.generateHash(password);

		await this.userRepository.save(user);
	}
}

export default ResetPasswordService;
