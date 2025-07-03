import { Injectable } from '@nestjs/common';
import { User, CreateUserDto, UpdateUserDto } from './interfaces/user.interface';
import { KafkaService } from '../kafka/kafka.service';

@Injectable()
export class UsersService {
  constructor(private readonly kafkaService: KafkaService) {}
  private users: User[] = [
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan@example.com',
      createdAt: new Date('2025-01-01'),
    },
    {
      id: 2,
      name: 'María González',
      email: 'maria@example.com',
      createdAt: new Date('2025-01-02'),
    },
  ];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  create(createUserDto: CreateUserDto): User {
    const newUser: User = {
      id: this.users.length + 1,
      ...createUserDto,
      createdAt: new Date(),
    };
    this.users.push(newUser);
    
    // 🔥 ENVIAR EVENTO KAFKA cuando se crea un usuario
    this.kafkaService.publishUserCreated(newUser);
    
    return newUser;
  }

  update(id: number, updateUserDto: UpdateUserDto): User | undefined {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return undefined;
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateUserDto,
    };

    // 🔥 ENVIAR EVENTO KAFKA cuando se actualiza un usuario
    this.kafkaService.publishUserUpdated(this.users[userIndex]);

    return this.users[userIndex];
  }

  remove(id: number): boolean {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return false;
    }

    // 🔥 ENVIAR EVENTO KAFKA antes de eliminar el usuario
    this.kafkaService.publishUserDeleted(id);

    this.users.splice(userIndex, 1);
    return true;
  }
}
