import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('Update Profile', () => {
	beforeEach(() => {
		fakeUserRepository = new FakeUserRepository();
		fakeHashProvider = new FakeHashProvider();

		updateProfileService = new UpdateProfileService(
			fakeUserRepository,
			fakeHashProvider,
		);
	});

	it('should be able to update the user profile', async () => {
		const user = await fakeUserRepository.create({
			name: 'John Doe',
			email: 'john@example.com',
			password: '123456',
		});

		const updatedUser = await updateProfileService.execute({
			user_id: user.id,
			name: 'John Trê',
			email: 'johntre@example.com',
		});

		await expect(updatedUser.name).toBe('John Trê');
		await expect(updatedUser.email).toBe('johntre@example.com');
	});

	it('should not be able to change to another user email', async () => {
		await fakeUserRepository.create({
			name: 'John Doe',
			email: 'john@example.com',
			password: '123456',
		});

		const user = await fakeUserRepository.create({
			name: 'Test',
			email: 'test@example.com',
			password: '123456',
		});

		await expect(
			updateProfileService.execute({
				user_id: user.id,
				name: 'John Trê',
				email: 'john@example.com',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should be able to update the password', async () => {
		const user = await fakeUserRepository.create({
			name: 'John Doe',
			email: 'john@example.com',
			password: '123456',
		});

		const updatedUser = await updateProfileService.execute({
			user_id: user.id,
			name: 'John Doe',
			email: 'john@example.com',
			old_password: '123456',
			password: '123123',
		});

		await expect(updatedUser.password).toBe('123123');
	});

	it('should not be able to update the password without old password', async () => {
		const user = await fakeUserRepository.create({
			name: 'John Doe',
			email: 'john@example.com',
			password: '123456',
		});

		await expect(
			updateProfileService.execute({
				user_id: user.id,
				name: 'John Doe',
				email: 'john@example.com',
				password: '123123',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to update the password with wrong old password', async () => {
		const user = await fakeUserRepository.create({
			name: 'John Doe',
			email: 'john@example.com',
			password: '123456',
		});

		await expect(
			updateProfileService.execute({
				user_id: user.id,
				name: 'John Doe',
				email: 'john@example.com',
				old_password: 'wrong-old-password',
				password: '123123',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able update the profile from non-existing user', async () => {
		await expect(
			updateProfileService.execute({
				user_id: 'non-existing-id',
				name: 'Test',
				email: 'test@example.com',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
