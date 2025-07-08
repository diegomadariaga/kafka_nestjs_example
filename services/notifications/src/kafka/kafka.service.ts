import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private consumer: Consumer;

  constructor() {
    const brokerUrl = process.env.KAFKA_BROKERS || 'localhost:9092';
    console.log('Kafka broker URL:', brokerUrl);
    
    this.kafka = new Kafka({
      clientId: 'notifications-service',
      brokers: [brokerUrl],
      retry: {
        initialRetryTime: 100,
        retries: 8,
        maxRetryTime: 30000,
        factor: 2,
        multiplier: 1.5,
        restartOnFailure: (e) => {
          console.error(
            'Kafka connection failed, attempting restart:',
            e.message,
          );
          return Promise.resolve(true);
        },
      },
      connectionTimeout: 10000,
      requestTimeout: 30000,
    });
    
    this.consumer = this.kafka.consumer({
      groupId: 'notifications-group',
      retry: {
        retries: 5,
        restartOnFailure: (e) => {
          console.error('Consumer failed, attempting restart:', e.message);
          return Promise.resolve(true);
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.consumer.connect();
      console.log('Kafka consumer connected successfully');
      
      // Suscribirse al tópico de usuarios creados
      await this.consumer.subscribe({
        topic: 'user.created',
        fromBeginning: false,
      });

      // Procesar mensajes
      await this.consumer.run({
        eachMessage: async ({ topic, message }) => {
          try {
            const value = message.value?.toString();
            if (value) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              const event = JSON.parse(value);
              console.log(`Received message from topic ${topic}:`, event);
              
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              if (event.eventType === 'USER_CREATED') {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                await this.handleUserCreatedEvent(event);
              }
            }
          } catch (error) {
            console.error('Error processing message:', error);
          }
        },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error('Failed to connect to Kafka consumer:', errorMessage);
      // Don't throw error to prevent application startup failure
    }
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
    console.log('Kafka consumer disconnected');
  }

  private async handleUserCreatedEvent(event: any) {
    console.log('Processing user created event:', event);
    
    // Aquí puedes agregar la lógica para enviar notificaciones
    // Por ejemplo: enviar email, push notification, etc.
    console.log(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      `🔔 Notification: New user created - ${event.data.nombre} (${event.data.email})`,
    );
    
    // Simular procesamiento de notificación
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    await this.sendWelcomeNotification(event.data);
  }

  private async sendWelcomeNotification(userData: any) {
    // Simular envío de notificación de bienvenida
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log(`📧 Sending welcome notification to ${userData.email}`);
    
    // Aquí podrías integrar con servicios reales como:
    // - SendGrid para emails
    // - Firebase para push notifications
    // - Slack para notificaciones de equipo
    // etc.
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.log(`✅ Welcome notification sent to ${userData.nombre}`);
        resolve();
      }, 1000);
    });
  }
}
