import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async register(data: RegisterUserDto): Promise<User> {
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

    return user;
  }
}
