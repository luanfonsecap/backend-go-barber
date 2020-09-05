import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUserRepository';

interface IRequestDTO {
	user_id: string;
}

@injectable()
class ShowProfileService {
	constructor(
		@inject('UserRepository')
		private userRepository: IUserRepository,
	) {}

	public async execute({ user_id }: IRequestDTO): Promise<User> {
		const user = await this.userRepository.findById(user_id);

		if (!user) {
			throw new AppError('User not found.');
		}

		return user;
	}
}

export default ShowProfileService;
