import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { DatabaseService } from '../database/database.service';
import { User } from '../entities/user.entity';

interface DatabaseUser {
  id: number;
  nombre: string;
  email: string;
  password: string;
  created_at: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const { nombre, email, password } = createUserDto;

    // Verificar si el usuario ya existe
    const existingUser: DatabaseUser | undefined =
      await this.databaseService.getUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Encriptar la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear el usuario en la base de datos
    const userId = await this.databaseService.createUser(
      nombre,
      email,
      hashedPassword,
    );

    // Obtener el usuario creado sin la contraseña
    const newUser: DatabaseUser | undefined =
      await this.databaseService.getUserById(userId);

    if (!newUser) {
      throw new Error('Error al crear el usuario');
    }

    return {
      id: newUser.id,
      nombre: newUser.nombre,
      email: newUser.email,
      createdAt: new Date(newUser.created_at),
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const user: DatabaseUser | undefined =
      await this.databaseService.getUserByEmail(email);
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      password: user.password,
      createdAt: new Date(user.created_at),
    };
  }

  async findById(id: number): Promise<Omit<User, 'password'> | null> {
    const user: DatabaseUser | undefined =
      await this.databaseService.getUserById(id);
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      createdAt: new Date(user.created_at),
    };
  }
}
