import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { provider_id, date } = request.body;
    const user_id = request.user.id;

    // Definindo as regras de negócios de criação de um repositório no service
    const createAppointment = container.resolve(CreateAppointmentService);

    // executando o service - Validação e criação de um repositório
    const appointment = await createAppointment.execute({
      date,
      provider_id,
      user_id,
    });
    return response.json(appointment);
  }
}
