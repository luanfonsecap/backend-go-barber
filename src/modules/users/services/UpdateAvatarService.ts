import path from 'path';
import fs from 'fs';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import uploadConfig from '@config/upload';
import User from '@modules/users/infra/typeorm/entities/User';
import IStorageProvider from '@shared/container/Providers/StorageProvider/models/IStorageProvider';
import IUserRepository from '../repositories/IUserRepository';

interface IRequestDTO {
	user_id: string;
	avatarFileName: string;
}

@injectable()
class UpdateAvatarService {
	constructor(
		@inject('UserRepository')
		private userRepository: IUserRepository,

		@inject('StorageProvider')
		private storageProvider: IStorageProvider,
	) {}

	public async execute({
		user_id,
		avatarFileName,
	}: IRequestDTO): Promise<User> {
		const user = await this.userRepository.findById(user_id);

		if (!user) {
			throw new AppError('Only authenticated user can change avatar', 401);
		}

		if (user.avatar) {
			await this.storageProvider.deleteFile(user.avatar);
		}

		const fileName = await this.storageProvider.saveFile(avatarFileName);

		user.avatar = fileName;

		await this.userRepository.save(user);

		return user;
	}
}

export default UpdateAvatarService;
