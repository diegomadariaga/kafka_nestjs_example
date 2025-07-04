import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { KafkaService } from '../kafka/kafka.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly kafkaService: KafkaService,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const { nombre, email, password } = createUserDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Encriptar la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear el usuario
    const user = this.userRepository.create({
      nombre,
      email,
      password: hashedPassword,
    });

    // Guardar el usuario en la base de datos
    const savedUser = await this.userRepository.save(user);

    // Retornar el usuario sin la contraseña
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = savedUser;

    // Emitir evento a Kafka después de la creación exitosa
    try {
      await this.kafkaService.sendUserCreatedEvent(userWithoutPassword);
    } catch (error) {
      console.error('Error al enviar evento a Kafka:', error);
      // No fallar la creación del usuario si Kafka falla
    }

    return userWithoutPassword;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async findById(id: number): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
