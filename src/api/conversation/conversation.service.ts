import { Injectable } from '@nestjs/common';
import { Conversation, Message, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateConversationDto } from './dto/create-conversation.dto';

type ConversationWithUsers = Conversation & {
  users: User[];
  messages: Message[];
};
@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  async findOrCreateConversation(
    createConversationDto: CreateConversationDto,
  ): Promise<ConversationWithUsers> {
    const { receiver, sender } = createConversationDto;

    const include = {
      users: true,
      messages: true,
    };

    const existingConversation = await this.prisma.conversation.findFirst({
      where: {
        AND: [
          { users: { some: { id: { equals: sender.id } } } },
          { users: { some: { id: { equals: receiver.id } } } },
        ],
      },
      include,
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
        include,
      });
      return newConversation;
    }
  }
}
