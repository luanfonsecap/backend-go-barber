import FakeStorageProvider from '@shared/container/Providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import UpdateAvatarService from './UpdateAvatarService';

let fakeUserRepository: FakeUserRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatarService: UpdateAvatarService;

describe('Create User', () => {
	beforeEach(() => {
		fakeUserRepository = new FakeUserRepository();
		fakeStorageProvider = new FakeStorageProvider();

		updateUserAvatarService = new UpdateAvatarService(
			fakeUserRepository,
			fakeStorageProvider,
		);
	});

	it('should be able to update a user avatar', async () => {
		const user = await fakeUserRepository.create({
			name: 'John Doe',
			email: 'john@example.com',
			password: '123456',
		});

		await updateUserAvatarService.execute({
			user_id: user.id,
			avatarFileName: 'avatar.jpeg',
		});

		await expect(user.avatar).toBe('avatar.jpeg');
	});

	it('should not be able to update avatar from non existing user', async () => {
		updateUserAvatarService.execute({
			user_id: 'non-existing-user',
			avatarFileName: 'avatar.jpeg',
		});

		await expect(
			updateUserAvatarService.execute({
				user_id: 'non-existing-user',
				avatarFileName: 'avatar.jpeg',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should delete avatar when updating new one', async () => {
		const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

		const user = await fakeUserRepository.create({
			name: 'John Doe',
			email: 'john@example.com',
			password: '123456',
		});

		await updateUserAvatarService.execute({
			user_id: user.id,
			avatarFileName: 'avatar.jpeg',
		});

		await updateUserAvatarService.execute({
			user_id: user.id,
			avatarFileName: 'avatar2.jpeg',
		});

		await expect(deleteFile).toHaveBeenCalledWith('avatar.jpeg');
		await expect(user.avatar).toBe('avatar2.jpeg');
	});
});
