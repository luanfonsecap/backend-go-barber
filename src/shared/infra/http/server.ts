import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction, response } from 'express';
import { errors } from 'celebrate';
import cors from 'cors';
import 'express-async-errors';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from '@shared/infra/http/routes';
import rateLimiter from './middlewares/rateLimiter';

import '@shared/infra/typeorm';
import '@shared/container';
import '@shared/container/Providers';

const app = express();

app.use(rateLimiter);
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadFolder));
app.use(routes);

app.use(errors());

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
	if (err instanceof AppError) {
		return res.status(err.statusCode).json({
			status: 'error',
			message: err.message,
		});
	}

	// eslint-disable-next-line no-console
	console.warn(err);

	return response.status(500).json({
		status: 'error',
		message: 'Internal Server Error',
	});
});

// eslint-disable-next-line no-console
app.listen(3333, () => console.log('🔥️ Server started.'));
