import { Controller, Get, Post, Put, Delete, Param, Body, Query, HttpException, HttpStatus } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Notification, CreateNotificationDto, UpdateNotificationDto } from './interfaces/notification.interface';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@Query('userId') userId?: string): Notification[] {
    if (userId) {
      return this.notificationsService.findByUserId(parseInt(userId, 10));
    }
    return this.notificationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Notification {
    const notification = this.notificationsService.findOne(id);
    
    if (!notification) {
      throw new HttpException('Notificación no encontrada', HttpStatus.NOT_FOUND);
    }
    
    return notification;
  }

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto): Notification {
    if (!createNotificationDto.userId || !createNotificationDto.title || !createNotificationDto.message) {
      throw new HttpException('userId, title y message son requeridos', HttpStatus.BAD_REQUEST);
    }
    
    return this.notificationsService.create(createNotificationDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto): Notification {
    const updatedNotification = this.notificationsService.update(id, updateNotificationDto);
    
    if (!updatedNotification) {
      throw new HttpException('Notificación no encontrada', HttpStatus.NOT_FOUND);
    }
    
    return updatedNotification;
  }

  @Post(':id/send')
  markAsSent(@Param('id') id: string): Notification {
    const notification = this.notificationsService.markAsSent(id);
    
    if (!notification) {
      throw new HttpException('Notificación no encontrada', HttpStatus.NOT_FOUND);
    }
    
    return notification;
  }

  @Delete(':id')
  remove(@Param('id') id: string): { message: string } {
    const deleted = this.notificationsService.remove(id);
    
    if (!deleted) {
      throw new HttpException('Notificación no encontrada', HttpStatus.NOT_FOUND);
    }
    
    return { message: 'Notificación eliminada correctamente' };
  }
}
