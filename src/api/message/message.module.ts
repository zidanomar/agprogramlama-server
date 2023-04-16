import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { ConversationService } from '../conversation/conversation.service';
import { MessageController } from './message.controller';

@Module({
  providers: [MessageService, ConversationService],
  controllers: [MessageController],
})
export class MessageModule {}
