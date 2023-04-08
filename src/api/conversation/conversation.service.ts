import { Injectable } from '@nestjs/common';
import { Conversation, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateConversationDto } from './dto/create-conversation.dto';

type ConversationWithUsers = Conversation & {
  users: User[];
};
@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  async createConversation(
    createConversationDto: CreateConversationDto,
  ): Promise<ConversationWithUsers[]> {
    const { receivers, sender, type, name } = createConversationDto;

    const conversations: ConversationWithUsers[] = await Promise.all(
      receivers.map(async (receiver) => {
        const existingConversation = await this.prisma.conversation.findFirst({
          where: {
            AND: [
              { users: { some: { id: { equals: sender.id } } } },
              { users: { some: { id: { equals: receiver.id } } } },
            ],
          },
          include: {
            users: true,
          },
        });

        if (existingConversation) {
          return existingConversation;
        } else {
          const newConversation = await this.prisma.conversation.create({
            data: {
              name,
              type,
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
      }),
    );

    return conversations;
  }
}
