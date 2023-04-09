import { Injectable } from '@nestjs/common';
import { Conversation, Message, Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateConversationDto } from './dto/create-conversation.dto';

type ConversationDetail = Conversation & {
  users: User[];
  messages: Message[];
};

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

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
