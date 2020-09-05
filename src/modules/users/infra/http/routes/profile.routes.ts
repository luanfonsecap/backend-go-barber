import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ProfileController from '@modules/users/infra/http/controllers/ProfileController';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const profileController = new ProfileController();

const profileRouter = Router();

const schema = Joi.object()
	.keys({
		name: Joi.string(),
		email: Joi.string().email(),
		oldPassword: Joi.string(),
		password: Joi.string(),
		passwordConfirmation: Joi.string().valid(Joi.ref('password')),
	})
	.and('oldPassword', 'password');

profileRouter.use(ensureAuthenticated);

profileRouter.get('/', profileController.show);

profileRouter.put(
	'/',
	celebrate({
		[Segments.BODY]: schema,
	}),
	profileController.update,
);

export default profileRouter;
