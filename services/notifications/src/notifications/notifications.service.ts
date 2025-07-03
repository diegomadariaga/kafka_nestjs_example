import { Injectable } from '@nestjs/common';
import { Notification, CreateNotificationDto, UpdateNotificationDto } from './interfaces/notification.interface';

@Injectable()
export class NotificationsService {
  private notifications: Notification[] = [
    {
      id: '1',
      userId: 1,
      title: 'Bienvenido',
      message: 'Bienvenido a nuestro sistema',
      type: 'email',
      status: 'sent',
      createdAt: new Date('2025-07-01'),
      sentAt: new Date('2025-07-01'),
    },
    {
      id: '2',
      userId: 2,
      title: 'Recordatorio',
      message: 'No olvides completar tu perfil',
      type: 'push',
      status: 'pending',
      createdAt: new Date('2025-07-02'),
    },
  ];

  findAll(): Notification[] {
    return this.notifications;
  }

  findByUserId(userId: number): Notification[] {
    return this.notifications.filter(notification => notification.userId === userId);
  }

  findOne(id: string): Notification | undefined {
    return this.notifications.find(notification => notification.id === id);
  }

  create(createNotificationDto: CreateNotificationDto): Notification {
    const newNotification: Notification = {
      id: (this.notifications.length + 1).toString(),
      ...createNotificationDto,
      status: 'pending',
      createdAt: new Date(),
    };
    this.notifications.push(newNotification);
    return newNotification;
  }

  update(id: string, updateNotificationDto: UpdateNotificationDto): Notification | undefined {
    const notificationIndex = this.notifications.findIndex(notification => notification.id === id);
    if (notificationIndex === -1) {
      return undefined;
    }

    this.notifications[notificationIndex] = {
      ...this.notifications[notificationIndex],
      ...updateNotificationDto,
    };

    return this.notifications[notificationIndex];
  }

  markAsSent(id: string): Notification | undefined {
    const notification = this.findOne(id);
    if (!notification) {
      return undefined;
    }

    return this.update(id, { status: 'sent', sentAt: new Date() } as any);
  }

  remove(id: string): boolean {
    const notificationIndex = this.notifications.findIndex(notification => notification.id === id);
    if (notificationIndex === -1) {
      return false;
    }

    this.notifications.splice(notificationIndex, 1);
    return true;
  }
}
