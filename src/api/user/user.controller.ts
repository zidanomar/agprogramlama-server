import { Controller, UseGuards, Get, Request, Header } from '@nestjs/common';

import { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUser(@Request() req): Promise<User> {
    return this.userService.getUser(req.user.id);
  }
}
