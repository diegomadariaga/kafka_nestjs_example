import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { KafkaService } from '../kafka/kafka.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, KafkaService],
  exports: [UsersService],
})
export class UsersModule {}
