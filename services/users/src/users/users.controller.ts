import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, CreateUserDto, UpdateUserDto } from './interfaces/user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): User[] {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): User {
    const userId = parseInt(id, 10);
    const user = this.usersService.findOne(userId);
    
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    
    return user;
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): User {
    if (!createUserDto.name || !createUserDto.email) {
      throw new HttpException('Nombre y email son requeridos', HttpStatus.BAD_REQUEST);
    }
    
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): User {
    const userId = parseInt(id, 10);
    const updatedUser = this.usersService.update(userId, updateUserDto);
    
    if (!updatedUser) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    
    return updatedUser;
  }

  @Delete(':id')
  remove(@Param('id') id: string): { message: string } {
    const userId = parseInt(id, 10);
    const deleted = this.usersService.remove(userId);
    
    if (!deleted) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    
    return { message: 'Usuario eliminado correctamente' };
  }
}
