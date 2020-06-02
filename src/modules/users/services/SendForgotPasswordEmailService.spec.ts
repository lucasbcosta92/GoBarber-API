import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

// descrição
describe('SendForgotPasswordEmail', () => {
  // instanciando as variaveis criadas acima antes de cada teste (isso é feito p/ ñ repetir cpodigo)
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  // criando o teste (params -> descrição e o teste em si)
  it('should be able to recover the password using the email', async () => {
    // Verificando se o email foi enviado de fato
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    // criando usuário
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'Johndoe@example.com',
      password: '123456',
    });

    // enviando o e-mail para o e-mail do usuário
    await sendForgotPasswordEmail.execute({
      email: 'Johndoe@example.com',
    });

    // o que esperamos do teste -> Que o email tenha sido enviado para o usuário
    expect(sendMail).toHaveBeenCalled();
  });

  it('should be able to recover a non-existing user password', async () => {
    // o que esperamos do teste -> Que o email não seja enviado caso o usuário não exista
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'Johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    // Verificando o token de recuperação de senha foi gerado
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    // criando usuário
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'Johndoe@example.com',
      password: '123456',
    });

    // enviando o e-mail para o e-mail do usuário
    await sendForgotPasswordEmail.execute({
      email: 'Johndoe@example.com',
    });

    // o que esperamos do teste -> Que seja gerado um token dizendo a qual usuário a recuperação pertence
    await expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
