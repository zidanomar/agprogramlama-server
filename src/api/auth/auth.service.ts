import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userId: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async verifyToken(token: string): Promise<User> {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.validateUser(decoded.id);
      return user;
    } catch (err) {
      throw new Error('Invalid token');
    }
  }

  async login(loginDto: LoginDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
      include: {
        userCredential: true,
      },
    });

    if (!existingUser) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const isMatch = await bcrypt.compare(
      loginDto.password,
      existingUser.userCredential.password,
    );

    if (!isMatch) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    delete existingUser.userCredential;

    return {
      access_token: this.jwtService.sign(existingUser),
      user: existingUser,
    };
  }

  async register(
    data: RegisterUserDto,
  ): Promise<{ access_token: string; user: User }> {
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
      user,
    };
  }
}
