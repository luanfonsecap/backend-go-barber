import AppError from '@shared/errors/AppError';

import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import ShowProfileService from './ShowProfileService';

let fakeUserRepository: FakeUserRepository;
let showProfileService: ShowProfileService;

describe('Show Profile', () => {
	beforeEach(() => {
		fakeUserRepository = new FakeUserRepository();
		showProfileService = new ShowProfileService(fakeUserRepository);
	});

	it('should be able to show the user profile', async () => {
		const user = await fakeUserRepository.create({
			name: 'John Doe',
			email: 'john@example.com',
			password: '123456',
		});

		const userProfile = await showProfileService.execute({ user_id: user.id });

		expect(userProfile.name).toBe('John Doe');
		expect(userProfile.email).toBe('john@example.com');
	});

	it('should not be able show the profile from non-existing user', async () => {
		await expect(
			showProfileService.execute({ user_id: 'non-existing-id' }),
		).rejects.toBeInstanceOf(AppError);
	});
});
