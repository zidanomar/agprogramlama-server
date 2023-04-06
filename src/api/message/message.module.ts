import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';
import { ConversationService } from '../conversation/conversation.service';

@Module({
  providers: [MessageGateway, MessageService, ConversationService],
})
export class MessageModule {}
