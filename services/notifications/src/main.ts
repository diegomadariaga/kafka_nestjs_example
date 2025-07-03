import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS
  app.enableCors();
  
  // Configurar puerto
  const port = process.env.PORT || 3002;
  
  await app.listen(port);
  console.log(`🔔 Servicio de Notificaciones corriendo en http://localhost:${port}`);
}

bootstrap();
