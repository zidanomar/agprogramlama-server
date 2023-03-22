import { Controller, Body, UseGuards, Get, Request } from '@nestjs/common';
import { Post } from '@nestjs/common/decorators';
import { User } from '@prisma/client';
import { get } from 'http';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUser(@Request() req): Promise<User> {
    return this.userService.getUser(req.user.id);
  }

  @Post('register')
  async register(
    @Body() userData: RegisterUserDto,
  ): Promise<{ access_token: string }> {
    return this.userService.register(userData);
  }
}
