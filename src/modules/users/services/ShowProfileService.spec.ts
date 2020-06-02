import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

// descrição
describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  // criando o teste (params -> descrição e o teste em si)
  it('should be able show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'Johndoe@example.com',
      password: '123456',
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });

    // o que esperamos do teste -> Que o nome e email do usuário seja igual a "John Doe" e "Johndoe@example.com"
    expect(profile.name).toBe('John Doe');
    expect(profile.email).toBe('Johndoe@example.com');
  });

  // criando o teste (params -> descrição e o teste em si)
  it('should be able show the profile', async () => {
    // o que esperamos do teste -> Que exiba um erro de que o usuário não existe
    await expect(
      showProfile.execute({
        user_id: 'non-existing-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
