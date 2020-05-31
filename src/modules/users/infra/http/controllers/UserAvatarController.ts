import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateAvatarService from '@modules/users/services/UpdateAvatarService';

export default class AvatarUserController {
	public async update(req: Request, res: Response): Promise<Response> {
		const updateAvatar = container.resolve(UpdateAvatarService);

		const user = await updateAvatar.execute({
			user_id: req.user.id,
			avatarFileName: req.file.filename,
		});

		return res.json(classToClass(user));
	}
}
