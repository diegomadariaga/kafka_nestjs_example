import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private consumer: Consumer;

  constructor(private readonly notificationsService: NotificationsService) {
    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID || 'notifications-service',
      brokers: [process.env.KAFKA_BROKERS || 'kafka:9092'],
    });
    
    this.consumer = this.kafka.consumer({ 
      groupId: 'notifications-group' // Grupo de consumidores
    });
  }

  async onModuleInit() {
    try {
      await this.consumer.connect();
      console.log('🔗 Kafka Consumer conectado exitosamente');
      
      // Suscribirse al topic de eventos de usuario
      await this.consumer.subscribe({ topic: 'user-events' });
      
      // Comenzar a consumir mensajes
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
          await this.handleMessage(topic, partition, message);
        },
      });
      
      console.log('👂 Escuchando eventos en topic: user-events');
    } catch (error) {
      console.error('❌ Error conectando Kafka Consumer:', error);
    }
  }

  async onModuleDestroy() {
    try {
      await this.consumer.disconnect();
      console.log('🔌 Kafka Consumer desconectado');
    } catch (error) {
      console.error('❌ Error desconectando Kafka Consumer:', error);
    }
  }

  /**
   * Procesa los mensajes recibidos desde Kafka
   */
  private async handleMessage(topic: string, partition: number, message: any) {
    try {
      const messageValue = message.value?.toString();
      const eventType = message.headers?.['event-type']?.toString();
      
      if (!messageValue) {
        console.warn('⚠️ Mensaje vacío recibido');
        return;
      }

      const eventData = JSON.parse(messageValue);
      
      console.log(`📥 Evento recibido:`, {
        topic,
        partition,
        offset: message.offset,
        eventType,
        eventData,
      });

      // Procesar según el tipo de evento
      switch (eventType) {
        case 'USER_CREATED':
          await this.handleUserCreated(eventData);
          break;
        case 'USER_UPDATED':
          await this.handleUserUpdated(eventData);
          break;
        case 'USER_DELETED':
          await this.handleUserDeleted(eventData);
          break;
        default:
          console.warn(`⚠️ Tipo de evento no manejado: ${eventType}`);
      }
    } catch (error) {
      console.error('❌ Error procesando mensaje:', error);
    }
  }

  /**
   * Maneja el evento de usuario creado
   */
  private async handleUserCreated(eventData: any) {
    try {
      // Crear notificación de bienvenida
      const notification = await this.notificationsService.create({
        userId: eventData.userId,
        title: `¡Bienvenido ${eventData.userName}!`,
        message: `Hola ${eventData.userName}, tu cuenta ha sido creada exitosamente. ¡Bienvenido a nuestra plataforma!`,
        type: 'email',
      });

      console.log('🔔 Notificación de bienvenida creada:', notification);
    } catch (error) {
      console.error('❌ Error creando notificación de bienvenida:', error);
    }
  }

  /**
   * Maneja el evento de usuario actualizado
   */
  private async handleUserUpdated(eventData: any) {
    try {
      // Crear notificación de actualización
      const notification = await this.notificationsService.create({
        userId: eventData.userId,
        title: 'Perfil actualizado',
        message: `${eventData.userName}, tu perfil ha sido actualizado correctamente.`,
        type: 'push',
      });

      console.log('🔔 Notificación de actualización creada:', notification);
    } catch (error) {
      console.error('❌ Error creando notificación de actualización:', error);
    }
  }

  /**
   * Maneja el evento de usuario eliminado
   */
  private async handleUserDeleted(eventData: any) {
    try {
      // Crear notificación de despedida
      const notification = await this.notificationsService.create({
        userId: eventData.userId,
        title: 'Cuenta eliminada',
        message: `Tu cuenta ha sido eliminada. ¡Esperamos verte pronto de nuevo!`,
        type: 'email',
      });

      console.log('🔔 Notificación de eliminación creada:', notification);
    } catch (error) {
      console.error('❌ Error creando notificación de eliminación:', error);
    }
  }
}
