import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessageService } from './message.service';
import { SendMessageDto } from './dto/send-message.dto';
import { WebSocketServer } from '@nestjs/websockets/decorators';

@WebSocketGateway()
export class MessageGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly messageService: MessageService) {}

  @SubscribeMessage('message:send')
  async sendMessage(@MessageBody() data: SendMessageDto) {
    const messages = await this.messageService.sendMessage(data);
    // messages.forEach((message) => {
    //   message.ConversationId
    // });
    console.log(messages);
  }
}
