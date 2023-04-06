import { Injectable } from '@nestjs/common';
import { Conversation } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  async createConversation(
    createConversationDto: CreateConversationDto,
  ): Promise<Conversation[]> {
    const { receiverIds, senderId, type, name } = createConversationDto;

    const conversations: Conversation[] = await Promise.all(
      receiverIds.map(async (receiverId) => {
        const existingConversation = await this.prisma.conversation.findFirst({
          where: {
            AND: [
              { users: { some: { id: { equals: senderId } } } },
              { users: { some: { id: { equals: receiverId } } } },
            ],
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
                connect: [{ id: senderId }, { id: receiverId }],
              },
            },
          });
          return newConversation;
        }
      }),
    );

    return conversations;
  }
}
