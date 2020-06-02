import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';

import 'express-async-errors';
import '@shared/infra/typeorm';
import '@shared/container';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import rateLimiter from './middlewares/rateLimiter';
import routes from './routes';

const app = express();

app.use(cors()); // configurando quem acessará nossa api
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder)); // rota para visualizar a imagem no navegador
app.use(rateLimiter); // middleware de controle de (nº) requisições
app.use(routes);

// middleware de validação de campos/dados -> Exibe o erro no JSON
app.use(errors());

// middleware p/ tratativa de erros
app.use(
  (err: Error, resquest: Request, response: Response, _: NextFunction) => {
    // erros conhecidos
    if (err instanceof AppError) {
      return response
        .status(err.statusCode)
        .json({ status: 'error', message: err.message });
    }

    // erros deconhecidos
    return response.status(500).json({
      status: 'error',
      message: err.message,
      // message: 'Internal server error',
    });
  },
);

app.listen(3333, () => {
  console.log('✔ Server started on port 3333!');
});
