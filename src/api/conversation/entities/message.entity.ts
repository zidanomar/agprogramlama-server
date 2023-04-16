import { Message } from '@prisma/client';
import { ConversationWithUsers } from './conversation.entity';

export type MessageDetail = Message & {
  conversation: ConversationWithUsers;
};
