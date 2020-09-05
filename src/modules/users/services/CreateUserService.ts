import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';
import ICacheProvider from '@shared/container/Providers/CacheProvider/models/ICacheProvider';
import IUserRepository from '../repositories/IUserRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequestDTO {
	name: string;
	email: string;
	password: string;
}

@injectable()
class CreateUserService {
	constructor(
		@inject('UserRepository')
		private userRepository: IUserRepository,

		@inject('HashProvider')
		private hashProvider: IHashProvider,

		@inject('CacheProvider')
		private cacheProvider: ICacheProvider,
	) {}

	public async execute({ name, email, password }: IRequestDTO): Promise<User> {
		const checkUserExist = await this.userRepository.findByEmail(email);

		if (checkUserExist) {
			throw new AppError('Email address already used.');
		}

		const passwordHash = await this.hashProvider.generateHash(password);

		const user = this.userRepository.create({
			name,
			email,
			password: passwordHash,
		});

		await this.cacheProvider.invalidatePrefix('providers-list');

		return user;
	}
}

export default CreateUserService;
