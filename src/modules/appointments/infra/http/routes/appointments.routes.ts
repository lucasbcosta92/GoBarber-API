import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

// aplicando o middleware de autenticação
appointmentsRouter.use(ensureAuthenticated);

// criação de appointments
// celebrate - Validação de campos/dados
appointmentsRouter.post(
  '/',
  celebrate({
    // Segments.BODY -> Campos do corpo
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date(),
    },
  }),
  appointmentsController.create,
);

// Listagem dos appointments do dia
appointmentsRouter.get('/me', providerAppointmentsController.index);

export default appointmentsRouter;
