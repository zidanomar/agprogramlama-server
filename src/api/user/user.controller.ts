import { Controller, Get, Body } from '@nestjs/common';
import { Post } from '@nestjs/common/decorators';
import { User } from '@prisma/client';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() userData: RegisterUserDto): Promise<User> {
    return this.userService.register(userData);
  }
}
