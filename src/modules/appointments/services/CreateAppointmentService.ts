import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable() // classe pode receebr injeção de dependencias
class CreateAppointmentService {
  constructor(
    // injetando dependencia
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  // O service só possui esse método além do constructor
  public async execute({
    date,
    provider_id,
    user_id,
  }: IRequest): Promise<Appointment> {
    // startOfHour - reinicia o horário. Ex.: de: 17:16:35 - para: 17:00:00
    const appointmentDate = startOfHour(date);

    // Verificando se a data e hora são anterior as atuais
    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create appointment on a paste date.");
    }

    // Verificando se o usuário que está tentando fazer o agendamento
    // não é um provider que está tentando agendar um horário consigo mesmo
    if (user_id === provider_id) {
      throw new AppError("You can't create appointment with yourself.");
    }

    // Verificando se o agendamento está num horário aceitavel - 8h ás 17h
    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        "You can't only create appointment between 8am and 5pm.",
      );
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    // chamando o repository que cria e salva o appointment
    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    // criando a notificação
    const dateFormatted = format(appointment.date, "dd/MM/yyyy 'às' HH'h'mm");
    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${dateFormatted}`,
    });

    // removendo os dados do cache
    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        'yyyy-M-d',
      )}`,
    );

    return appointment;
  }
}

export default CreateAppointmentService;
