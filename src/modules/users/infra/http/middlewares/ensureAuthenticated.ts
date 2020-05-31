import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';

interface ITokenPayload {
	iat: number;
	exp: number;
	sub: string;
}

export default function ensureAuthenticated(
	req: Request,
	res: Response,
	next: NextFunction,
): void {
	const { authorization } = req.headers;

	if (!authorization) {
		throw new Error('No Token provided.');
	}

	const [, token] = authorization.split(' ');

	try {
		const decoded = verify(token, authConfig.jwt.secret);

		const { sub } = decoded as ITokenPayload;

		req.user = {
			id: sub,
		};

		next();
	} catch {
		throw new Error('Invalid JWT Token.');
	}
}
