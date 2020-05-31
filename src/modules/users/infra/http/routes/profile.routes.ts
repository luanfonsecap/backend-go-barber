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
		old_password: Joi.string(),
		password: Joi.string(),
		password_confirmation: Joi.string().valid(Joi.ref('password')),
	})
	.and('old_password', 'password');

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
