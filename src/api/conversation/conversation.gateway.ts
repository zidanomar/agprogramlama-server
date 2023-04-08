import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CONVERSATION } from 'src/constant/socket.constant';
import { MessageService } from '../message/message.service';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';

@WebSocketGateway()
export class ConversationGateway {
  @WebSocketServer() server: Server;

  constructor(
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService,
  ) {}

  @SubscribeMessage(CONVERSATION['send-message'])
  async sendBroadcast(@MessageBody() data: CreateConversationDto) {
    const messages = await this.conversationService.createConversation(data);

    for (const { users } of messages) {
      // create message
    }

    return data;
  }
}
