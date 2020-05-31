import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICacheProvider from '@shared/container/Providers/CacheProvider/models/ICacheProvider';

interface IRequest {
	user_id: string;
}

@injectable()
class ListProvidersService {
	constructor(
		@inject('UserRepository')
		private userRepository: IUserRepository,

		@inject('CacheProvider')
		private cacheProvider: ICacheProvider,
	) {}

	public async execute({ user_id }: IRequest): Promise<User[]> {
		let users = await this.cacheProvider.recover<User[]>(
			`providers-list:${user_id}`,
		);

		if (!users) {
			users = await this.userRepository.findAllProviders({
				user_except_id: user_id,
			});

			await this.cacheProvider.save(`providers-list:${user_id}`, users);
		}

		return users;
	}
}

export default ListProvidersService;
