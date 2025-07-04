import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { User } from '../entities/user.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: join(__dirname, '../../../../../users.db'), // Base de datos en la raíz del proyecto
  entities: [User],
  synchronize: process.env.NODE_ENV !== 'prod', // Solo en desarrollo
  logging: process.env.NODE_ENV !== 'prod',
};
