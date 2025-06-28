import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '¡Hola! Bienvenido a la API básica con NestJS 🚀';
  }

  getHealth(): object {
    return {
      status: 'OK',
      message: 'La API está funcionando correctamente',
      timestamp: new Date().toISOString(),
    };
  }
}
