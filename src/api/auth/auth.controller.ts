import { Body, Controller, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ access_token: string; user: User }> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(
    @Body() userData: RegisterUserDto,
  ): Promise<{ access_token: string; user: User }> {
    return this.authService.register(userData);
  }
}
