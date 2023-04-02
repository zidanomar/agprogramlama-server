import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

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

  async updateUserSocketId(userId: string, socketId: string) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        socketId,
      },
    });
  }

  async getUserBySocketId(userId: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: { id: userId },
    });
  }
}
