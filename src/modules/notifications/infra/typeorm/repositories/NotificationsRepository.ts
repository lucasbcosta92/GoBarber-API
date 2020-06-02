// validando uma nova notificação
import { getMongoRepository, MongoRepository } from 'typeorm';

import INotficationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

import Notification from '../schemas/Notification';

class NotificationsRepository implements INotficationsRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    // o segundo parametro é o nome da conexão, visto que temos mais de um bd no projeto
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  // criando e salvando uma notificação no BD (Mongo)
  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = this.ormRepository.create({
      content,
      recipient_id,
    });

    await this.ormRepository.save(notification);

    return notification;
  }
}

export default NotificationsRepository;
