import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global prefix with APP_NAME and version
  const appName = process.env.APP_NAME || 'users';
  app.setGlobalPrefix(`${appName}/v1`);

  await app.listen(process.env.PORT || 3000);
}
void bootstrap();
