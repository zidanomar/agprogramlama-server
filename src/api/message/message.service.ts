import { Injectable } from '@nestjs/common';
import { Message } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConversationService } from '../conversation/conversation.service';
import { CreateConversationDto } from '../conversation/dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly conversationService: ConversationService,
  ) {}

  async sendMessage(data: SendMessageDto): Promise<Message[]> {
    const conversationDto: CreateConversationDto = {
      receiverIds: data.receivers.map((x) => x.id),
      senderId: data.sender.id,
      type: 'PRIVATE',
    };

    const conversations = await this.conversationService.createConversation(
      conversationDto,
    );

    return await Promise.all(
      conversations.map(async (conversation) => {
        const message = await this.prisma.message.create({
          data: {
            content: data.content,
            sender: {
              connect: { id: data.sender.id },
            },
            conversation: {
              connect: { id: conversation.id },
            },
          },
          include: {
            conversation: true,
          },
        });

        return message;
      }),
    );
  }
}
