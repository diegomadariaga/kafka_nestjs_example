import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID || 'users-service',
      brokers: [process.env.KAFKA_BROKERS || 'kafka:9092'],
    });
    
    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    try {
      await this.producer.connect();
      console.log('🔗 Kafka Producer conectado exitosamente');
    } catch (error) {
      console.error('❌ Error conectando Kafka Producer:', error);
    }
  }

  async onModuleDestroy() {
    try {
      await this.producer.disconnect();
      console.log('🔌 Kafka Producer desconectado');
    } catch (error) {
      console.error('❌ Error desconectando Kafka Producer:', error);
    }
  }

  /**
   * Envía un evento cuando se crea un usuario
   */
  async publishUserCreated(user: any) {
    try {
      const message = {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        eventType: 'USER_CREATED',
        timestamp: new Date().toISOString(),
      };

      await this.producer.send({
        topic: 'user-events',
        messages: [
          {
            key: `user-${user.id}`, // Clave para garantizar orden
            value: JSON.stringify(message),
            headers: {
              'event-type': 'USER_CREATED',
              'service': 'users-service',
            },
          },
        ],
      });

      console.log('📤 Evento USER_CREATED enviado:', message);
    } catch (error) {
      console.error('❌ Error enviando evento USER_CREATED:', error);
    }
  }

  /**
   * Envía un evento cuando se actualiza un usuario
   */
  async publishUserUpdated(user: any) {
    try {
      const message = {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        eventType: 'USER_UPDATED',
        timestamp: new Date().toISOString(),
      };

      await this.producer.send({
        topic: 'user-events',
        messages: [
          {
            key: `user-${user.id}`,
            value: JSON.stringify(message),
            headers: {
              'event-type': 'USER_UPDATED',
              'service': 'users-service',
            },
          },
        ],
      });

      console.log('📤 Evento USER_UPDATED enviado:', message);
    } catch (error) {
      console.error('❌ Error enviando evento USER_UPDATED:', error);
    }
  }

  /**
   * Envía un evento cuando se elimina un usuario
   */
  async publishUserDeleted(userId: number) {
    try {
      const message = {
        userId: userId,
        eventType: 'USER_DELETED',
        timestamp: new Date().toISOString(),
      };

      await this.producer.send({
        topic: 'user-events',
        messages: [
          {
            key: `user-${userId}`,
            value: JSON.stringify(message),
            headers: {
              'event-type': 'USER_DELETED',
              'service': 'users-service',
            },
          },
        ],
      });

      console.log('📤 Evento USER_DELETED enviado:', message);
    } catch (error) {
      console.error('❌ Error enviando evento USER_DELETED:', error);
    }
  }
}
