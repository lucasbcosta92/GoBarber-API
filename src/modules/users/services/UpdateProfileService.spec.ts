import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

// descrição
describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  // criando o teste (params -> descrição e o teste em si)
  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'Johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'Johntre@example.com',
    });

    // o que esperamos do teste -> Que os dados de nome e email do usuário tenha sido alterado
    expect(updatedUser.name).toBe('John Trê');
    expect(updatedUser.email).toBe('Johntre@example.com');
  });

  it('should be able show the profile', async () => {
    // o que esperamos do teste -> Que exiba um erro de que o usuário não existe
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-user',
        name: 'test',
        email: 'teste@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'Johndoe@example.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Test',
      email: 'test@example.com',
      password: '123456',
    });

    // o que esperamos do teste -> Que não seja possivel alterar o email de um usuário p/ um email já cadastrado
    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Trê',
        email: 'Johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'Johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Doe',
      email: 'Johndoe@example.com',
      old_password: '123456',
      password: '123123',
    });

    // o que esperamos do teste -> Que seja possivel alterar a senha do usuário, visto que ele forneceu a senha antiga
    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'Johndoe@example.com',
      password: '123456',
    });

    // o que esperamos do teste -> Que não seja possivel alterar a senha do usuário, visto que ele não forneceu a senha antiga
    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'Johndoe@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'Johndoe@example.com',
      password: '123456',
    });

    // o que esperamos do teste -> Que não seja possivel alterar a senha do usuário, visto que a senha antiga está incorreta
    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'Johndoe@example.com',
        old_password: 'Wrong-old-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
