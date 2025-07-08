import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { User } from '../entities/user.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: process.env.DATABASE_PATH || join(__dirname, '../../../../users.db'), // Base de datos configurable para Docker
  entities: [User],
  synchronize: process.env.NODE_ENV !== 'prod', // Solo en desarrollo
  logging: process.env.NODE_ENV !== 'prod',
};
console.log('TypeORM configuration:', typeOrmConfig);
