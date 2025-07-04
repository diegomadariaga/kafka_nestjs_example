export interface UserCreatedEvent {
  eventType: 'USER_CREATED';
  timestamp: string;
  data: {
    id: number;
    nombre: string;
    email: string;
    createdAt: Date;
  };
}
