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

  async getUserSocketId(userId: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async getReceivers(userId: string): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: {
        id: {
          not: userId,
        },
      },
    });
  }

  async userDisconnect(socketId: string): Promise<User | null> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        socketId,
      },
    });

    if (!existingUser) {
      return null;
    }

    return await this.prisma.user.update({
      where: {
        socketId,
      },
      data: {
        socketId: null,
      },
    });
  }
}
