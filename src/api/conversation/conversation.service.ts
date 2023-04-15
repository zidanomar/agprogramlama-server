import { Injectable, NotFoundException } from '@nestjs/common';
import { Conversation } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateConversationDto,
  CreateGroupConversationDto,
  SendBroadcastMessageDto,
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
  ): Promise<ConversationWithUsers> {
    const { receiver, sender } = createConversationDto;

    const existingConversation = await this.prisma.conversation.findFirst({
      where: {
        AND: [
          { users: { some: { id: { equals: sender.id } } } },
          { users: { some: { id: { equals: receiver.id } } } },
          { type: 'PERSONAL' },
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
      return await this.updateConvLastMsgAt(existingConversation.id);
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

  async sendBroadcastMessage(
    sendBroadcastMessageDto: SendBroadcastMessageDto,
  ): Promise<ConversationWithUsers[]> {
    const { receivers, sender } = sendBroadcastMessageDto;

    const conversations = await Promise.all(
      receivers.map(async (receiver) => {
        const conversation = await this.findOrCreateConversation({
          receiver,
          sender,
          type: 'PERSONAL',
        });

        await this.prisma.message.create({
          data: {
            content: sendBroadcastMessageDto.content,
            sender: {
              connect: {
                id: sender.id,
              },
            },
            conversation: {
              connect: {
                id: conversation.id,
              },
            },
          },
        });

        await this.updateConvLastMsgAt(conversation.id);
        return conversation;
      }),
    );

    return conversations;
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
      orderBy: [{ updatedAt: 'desc' }],
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

  // ===================== UPDATE =====================
  async updateConvLastMsgAt(
    conversationId: string,
  ): Promise<ConversationWithUsers> {
    return await this.prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
      },
      include: {
        users: true,
      },
    });
  }
}
