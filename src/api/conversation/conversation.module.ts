import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationGateway } from './conversation.gateway';
import { MessageService } from '../message/message.service';

@Module({
  providers: [ConversationGateway, ConversationService, MessageService],
})
export class ConversationModule {}
