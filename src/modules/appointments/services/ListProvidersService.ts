import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
}

@injectable()
class ListProvidersService {
  constructor(
    // injetando dependencia
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  // Listando todos os providers, menos o logado
  public async execute({ user_id }: IRequest): Promise<User[]> {
    // Recuperando os dados armazenados em cache que correspondem a esse usuário.
    // Caso não encontre, ele irá salvar
    let users = await this.cacheProvider.recover<User[]>(
      `providers-list:${user_id}`,
    );

    if (!users) {
      // Traz todos os usuários menos o usuário do provider logado
      users = await this.usersRepository.findAllProviders({
        except_user_id: user_id,
      });

      // salvando as informações em cacheProvider
      await this.cacheProvider.save(`providers-list:${user_id}`, users);
    }

    return users;
  }
}

export default ListProvidersService;
