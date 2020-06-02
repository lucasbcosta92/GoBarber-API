import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';
import ProvidersDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';
import ProvidersMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';

const providersRouter = Router();
const providersController = new ProvidersController();
const providersMonthAvailabilityController = new ProvidersMonthAvailabilityController();
const providersDayAvailabilityController = new ProvidersDayAvailabilityController();

// aplicando o middleware de autenticação
providersRouter.use(ensureAuthenticated);

// listagem de provider
providersRouter.get('/', providersController.index);

// Listagem de disponibilidade de dias e meses na agenda do prestador
providersRouter.get(
  '/:provider_id/month-availability',
  celebrate({
    // Segments.PARAMS -> Dados que vem como parametro na URL
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providersMonthAvailabilityController.index,
);

// Listagem dos horários do que que estão disponiveis
providersRouter.get(
  '/:provider_id/day-availability',
  celebrate({
    // Segments.PARAMS -> Dados que vem como parametro na URL
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providersDayAvailabilityController.index,
);

export default providersRouter;
