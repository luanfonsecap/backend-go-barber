import { uuid } from 'uuidv4';

import IUserRepository from '@modules/users/repositories/IUserRepository';
import IFindAllProvidersDTO from '@modules/appointments/dtos/IFindAllProvidersDTO';
import ICreateUserDTO from '../../dtos/ICreateUserDTO';
import User from '../../infra/typeorm/entities/User';

class FakeUserRepository implements IUserRepository {
	private users: User[] = [];

	public async findById(id: string): Promise<User | undefined> {
		const user = this.users.find(findUser => findUser.id === id);

		return user;
	}

	public async findByEmail(email: string): Promise<User | undefined> {
		const user = this.users.find(findUser => findUser.email === email);

		return user;
	}

	public async findAllProviders({ user_except_id }: IFindAllProvidersDTO) {
		let { users } = this;

		if (user_except_id) {
			users = this.users.filter(user => user.id !== user_except_id);
		}

		return users;
	}

	public async create(userData: ICreateUserDTO): Promise<User> {
		const user = new User();

		Object.assign(user, { id: uuid() }, userData);

		this.users.push(user);

		return user;
	}

	public async save(user: User): Promise<User> {
		const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

		this.users[findIndex] = user;

		return user;
	}
}

export default FakeUserRepository;
