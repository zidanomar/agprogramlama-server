import { Injectable } from '@nestjs/common';
import { Message } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConversationService } from '../conversation/conversation.service';
import { CreateConversationDto } from '../conversation/dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class MessageService {}
