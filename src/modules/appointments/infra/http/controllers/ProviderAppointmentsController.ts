import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ListProviderAppointmentService from '@modules/appointments/services/ListProviderAppointmentService';

export default class AppointmentsController {
	public async index(req: Request, res: Response): Promise<Response> {
		const provider_id = req.user.id;
		const { day, month, year } = req.query;

		const listProviderAppointmentService = container.resolve(
			ListProviderAppointmentService,
		);

		const appointments = await listProviderAppointmentService.execute({
			provider_id,
			day: Number(day),
			month: Number(month),
			year: Number(year),
		});

		return res.json(classToClass(appointments));
	}
}
