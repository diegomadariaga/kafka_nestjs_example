import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'users.db',
  entities: [User],
  synchronize: process.env.NODE_ENV !== 'prod', // Solo en desarrollo
  logging: process.env.NODE_ENV !== 'prod',
};
