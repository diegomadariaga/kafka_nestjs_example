import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { UserCreatedEvent } from '../dto/user-created-event.dto';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;

  constructor() {
    const brokerUrl = process.env.KAFKA_BROKERS || 'localhost:9092';
    console.log('Kafka broker URL:', brokerUrl);
    
    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID || 'users-service',
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
    this.producer = this.kafka.producer({
      retry: {
        retries: 5,
        restartOnFailure: (e) => {
          console.error('Producer failed, attempting restart:', e.message);
          return Promise.resolve(true);
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.producer.connect();
      console.log('Kafka producer connected successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error('Failed to connect to Kafka producer:', errorMessage);
      // Don't throw error to prevent application startup failure
      // The producer will retry connections automatically
    }
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    console.log('Kafka producer disconnected');
  }

  async sendMessage(topic: string, message: Record<string, any>) {
    try {
      await this.producer.send({
        topic,
        messages: [
          {
            value: JSON.stringify(message),
            timestamp: Date.now().toString(),
          },
        ],
      });
      console.log(`Message sent to topic ${topic}:`, message);
    } catch (error) {
      console.error('Error sending message to Kafka:', error);
      throw error;
    }
  }

  async sendUserCreatedEvent(user: Omit<UserCreatedEvent['data'], 'password'>) {
    const topic = process.env.KAFKA_USER_CREATED_TOPIC || 'user.created';
    const event: UserCreatedEvent = {
      eventType: 'USER_CREATED',
      timestamp: new Date().toISOString(),
      data: user,
    };
    await this.sendMessage(topic, event);
  }
}
