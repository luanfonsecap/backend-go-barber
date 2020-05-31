import { getRepository, Repository, Not } from 'typeorm';

import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/appointments/dtos/IFindAllProvidersDTO';
import User from '@modules/users/infra/typeorm/entities/User';

class UserRepository implements IUserRepository {
	private ormRepository: Repository<User>;

	constructor() {
		this.ormRepository = getRepository(User);
	}

	public async findById(id: string): Promise<User | undefined> {
		const user = await this.ormRepository.findOne(id);

		return user;
	}

	public async findByEmail(email: string): Promise<User | undefined> {
		const user = await this.ormRepository.findOne({
			where: { email },
		});

		return user;
	}

	public async findAllProviders({
		user_except_id,
	}: IFindAllProvidersDTO): Promise<User[]> {
		let users: User[];

		if (user_except_id) {
			users = await this.ormRepository.find({ id: Not(user_except_id) });
		} else {
			users = await this.ormRepository.find();
		}

		return users;
	}

	public async create(userData: ICreateUserDTO): Promise<User> {
		const user = this.ormRepository.create(userData);

		await this.ormRepository.save(user);

		return user;
	}

	public async save(user: User): Promise<User> {
		return this.ormRepository.save(user);
	}
}

export default UserRepository;
