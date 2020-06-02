import { container } from 'tsyringe';

import IHashProvider from './HashProvider/models/IHashProvider';
import BCryptHashProvider from './HashProvider/implementations/BCryptHashProvider';

// registerSingleTon - Registra a classe apenas uma única vez, sempre a reutilizando
container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
