export interface Notification {
  id: string;
  userId: number;
  title: string;
  message: string;
  type: 'email' | 'sms' | 'push';
  status: 'pending' | 'sent' | 'failed';
  createdAt: Date;
  sentAt?: Date;
}

export interface CreateNotificationDto {
  userId: number;
  title: string;
  message: string;
  type: 'email' | 'sms' | 'push';
}

export interface UpdateNotificationDto {
  title?: string;
  message?: string;
  type?: 'email' | 'sms' | 'push';
  status?: 'pending' | 'sent' | 'failed';
}
