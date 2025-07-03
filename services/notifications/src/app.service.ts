import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '🔔 Bienvenido al Servicio de Notificaciones';
  }

  getHealth(): object {
    return {
      service: 'notifications',
      status: 'OK',
      message: 'El servicio de notificaciones está funcionando correctamente',
      timestamp: new Date().toISOString(),
    };
  }
}
