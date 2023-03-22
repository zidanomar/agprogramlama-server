import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';

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

  async register(data: RegisterUserDto): Promise<{ access_token: string }> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User already exists',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        imageUri: data.imageUri,
        userCredential: {
          create: {
            password: data.password,
          },
        },
      },
    });

    return {
      access_token: this.jwtService.sign(user),
    };
  }
}
