import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { KafkaConsumerService } from '../kafka/kafka-consumer.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, KafkaConsumerService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
