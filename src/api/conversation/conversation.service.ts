import { Injectable, NotFoundException } from '@nestjs/common';
import { Message } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendMessageDto } from '../message/dto/send-message.dto';
import {
  CreateConversationDto,
  CreateGroupConversationDto,
  SendBroadcastMessageDto,
} from './dto/create-conversation.dto';
import {
  ConversationDetail,
  ConversationWithUsers,
} from './entities/conversation.entity';
import { MessageDetail } from './entities/message.entity';
import messageDecoder from 'src/utils/message-decoder';

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

  async sendMessage(sendMessageDto: SendMessageDto): Promise<MessageDetail> {
    const { sender, content, conversation } = sendMessageDto;

    return await this.prisma.message.create({
      data: {
        content,
        iv: '',
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
      include: {
        conversation: {
          include: {
            users: true,
          },
        },
      },
    });
  }

  async sendBroadcastMessage(
    sendBroadcastMessageDto: SendBroadcastMessageDto,
  ): Promise<
    { conversation: ConversationWithUsers; message: MessageDetail }[]
  > {
    const { receivers, sender, content } = sendBroadcastMessageDto;

    const conversations = await Promise.all(
      receivers.map(async (receiver) => {
        const conversation = await this.findOrCreateConversation({
          receiver,
          sender,
          type: 'PERSONAL',
        });

        const message = (await this.prisma.message.create({
          data: {
            content,
            iv: '',
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
        })) as MessageDetail;

        await this.updateConvLastMsgAt(conversation.id);
        return { conversation, message };
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

    const unseenMessagesCount = conversations.reduce((count, conversation) => {
      const messages = conversation.messages;
      const unseenMessages = messages.filter((message) => !message.seen);
      return count + unseenMessages.length;
    }, 0);

    return conversations.map((c) => {
      const convName =
        c.type === 'PERSONAL'
          ? c.users.filter((u) => u.id !== userId)[0].email
          : c.name;
      return {
        ...c,
        name: convName,
        unseenMessages: unseenMessagesCount,
      };
    });
  }

  async getConversationById(
    conversationId: string,
  ): Promise<ConversationDetail> {
    const conversation = await this.prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
        messages: {
          orderBy: {
            sentAt: 'asc',
          },
          include: {
            conversation: true,
          },
        },
      },
    });

    await this.prisma.message.updateMany({
      where: {
        conversationId,
        seen: false,
      },
      data: {
        seen: true,
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    for (const message of conversation.messages) {
      const decodedMessage = messageDecoder(message as MessageDetail);
      message.content = decodedMessage.content;
    }

    return {
      ...conversation,
      unseenMessages: conversation.messages.filter((m) => !m.seen).length,
    };
  }

  getUnseenMessages = async (userId: string): Promise<number> => {
    return await this.prisma.message.count({
      where: {
        AND: [
          {
            conversation: {
              users: {
                some: {
                  id: {
                    equals: userId,
                  },
                },
              },
            },
          },
          {
            seen: false,
          },
        ],
      },
    });
  };

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
