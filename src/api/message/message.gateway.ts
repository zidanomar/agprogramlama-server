import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessageService } from './message.service';
import { SendMessageBodyDto } from './dto/send-message.dto';
import { WebSocketServer } from '@nestjs/websockets/decorators';
import { MESSAGE } from 'src/constant/socket.constant';
import { ConversationService } from '../conversation/conversation.service';

@WebSocketGateway()
export class MessageGateway {
  @WebSocketServer() server: Server;

  constructor(
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService,
  ) {}

  @SubscribeMessage(MESSAGE['send-message'])
  async sendBroadcast(@MessageBody() data: SendMessageBodyDto) {
    const { receivers, sender } = data;

    for (const receiver of receivers) {
      const conversation =
        await this.conversationService.findOrCreateConversation({
          sender,
          receiver,
          type: 'PERSONAL',
        });

      console.log(conversation);

      const message = await this.messageService.sendMessage({
        content: data.content,
        sender,
        receiver,
        conversation,
      });

      console.log(message);

      this.server.emit(MESSAGE['send-message'], message);
    }

    return data;
  }
}
