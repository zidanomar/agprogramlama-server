import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateConversationDto,
  CreateGroupConversationDto,
} from './dto/create-conversation.dto';
import {
  ConversationDetail,
  ConversationWithUsers,
} from './entities/conversation.entity';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  // ===================== CREATE =====================
  async findOrCreateConversation(
    createConversationDto: CreateConversationDto,
  ): Promise<ConversationDetail> {
    const { receiver, sender } = createConversationDto;

    const existingConversation = await this.prisma.conversation.findFirst({
      where: {
        AND: [
          { users: { some: { id: { equals: sender.id } } } },
          { users: { some: { id: { equals: receiver.id } } } },
        ],
      },
      include: {
        users: true,
        messages: {
          orderBy: {
            sentAt: 'asc',
          },
        },
      },
    });

    if (existingConversation) {
      return existingConversation;
    } else {
      const newConversation = await this.prisma.conversation.create({
        data: {
          type: 'PERSONAL',
          users: {
            connect: [{ id: sender.id }, { id: receiver.id }],
          },
        },
        include: {
          users: true,
          messages: {
            orderBy: {
              sentAt: 'asc',
            },
          },
        },
      });
      return newConversation;
    }
  }

  async createGroupConversation(
    createConversationDto: CreateGroupConversationDto,
  ): Promise<ConversationWithUsers> {
    const { receivers, sender } = createConversationDto;

    const newConversation = await this.prisma.conversation.create({
      data: {
        type: 'GROUP',
        users: {
          connect: [{ id: sender.id }, ...receivers.map((r) => ({ id: r.id }))],
        },
        name: createConversationDto.name,
      },
      include: {
        users: true,
      },
    });

    return newConversation;
  }
  // ===================== READ =====================

  async getConversationsByUserId(
    userId: string,
  ): Promise<ConversationDetail[]> {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        users: {
          some: {
            id: {
              equals: userId,
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc', // Order by updatedAt field in descending order
      },
      include: {
        users: true,
        messages: {
          orderBy: {
            sentAt: 'asc',
          },
        },
      },
    });

    return conversations.map((c) => {
      const convName =
        c.type === 'PERSONAL'
          ? c.users.filter((u) => u.id !== userId)[0].email
          : c.name;
      return {
        ...c,
        name: convName,
      };
    });
  }

  async getConversationById(
    conversationId: string,
  ): Promise<ConversationDetail> {
    return await this.prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
        messages: {
          orderBy: {
            sentAt: 'asc',
          },
        },
      },
    });
  }
}
