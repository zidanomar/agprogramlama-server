import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';

@WebSocketGateway()
export class ConversationGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly conversationService: ConversationService) {}

  @SubscribeMessage('message:sendBroadcast')
  async sendBroadcast(@MessageBody() data: CreateConversationDto) {
    console.log('sendBroadcast', data);

    await this.conversationService.createConversation(data);
    // this.server.emit('message:receive', data);
    return data;
  }
}
