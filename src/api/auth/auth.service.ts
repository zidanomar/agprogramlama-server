import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

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
    };
  }
}
