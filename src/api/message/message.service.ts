import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';
import { MessageDetail } from './entity/message.entity';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}
  async sendMessage(sendMessageDto: SendMessageDto): Promise<MessageDetail> {
    const { content, sender, receiver, conversation } = sendMessageDto;

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
          connectOrCreate: {
            where: {
              id: conversation.id,
            },
            create: {
              type: 'PERSONAL',
              users: {
                connect: [
                  {
                    id: sender.id,
                  },
                  { id: receiver.id },
                ],
              },
            },
          },
        },
      },
      include: {
        sender: true,
        conversation: {
          include: {
            users: true,
          },
        },
      },
    });
  }
}
