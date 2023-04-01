import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterUserDto } from '../auth/dto/register-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async getUser(userId: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: { id: userId },
    });
  }
}
