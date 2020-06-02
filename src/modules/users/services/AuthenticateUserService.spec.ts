import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

// descrição
describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  // criando o teste (params -> descrição e o teste em si)
  it('should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'Johndoe@example.com',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      email: 'Johndoe@example.com',
      password: '123456',
    });

    // o que esperamos do teste -> Que ele possua um token e se o usuário do token é igual ao usuário
    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not to be able to authenticate with non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'Johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'Johndoe@example.com',
      password: '123456',
    });

    await expect(
      authenticateUser.execute({
        email: 'Johndoe@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
