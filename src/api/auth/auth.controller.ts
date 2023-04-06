import { Body, Controller, Post, Req } from '@nestjs/common';
import { User } from '@prisma/client';
import { Socket } from 'socket.io';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
  ): Promise<{ access_token: string; user: User }> {
    const { user, access_token } = await this.authService.login(loginDto);
    const socket: Socket = req['socket'];
    socket.emit('userLoggedIn', user);
    return { user, access_token };
  }

  @Post('register')
  async register(
    @Body() userData: RegisterUserDto,
  ): Promise<{ access_token: string; user: User }> {
    return await this.authService.register(userData);
  }
}
