import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationGateway } from './conversation.gateway';
import { MessageService } from '../message/message.service';
import { ConversationController } from './conversation.controller';

@Module({
  providers: [ConversationGateway, ConversationService, MessageService],
  controllers: [ConversationController],
})
export class ConversationModule {}
