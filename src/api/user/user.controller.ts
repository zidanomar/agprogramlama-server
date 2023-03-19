import { Controller, Get } from '@nestjs/common';
import { Post } from '@nestjs/common/decorators';
import { Prisma, User } from '@prisma/client';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post('register')
  async register(userData: Prisma.UserCreateInput): Promise<User> {
    return this.userService.register(userData);
  }
}
