import { Message, User } from '@prisma/client';
import { ConversationWithUsers } from 'src/api/conversation/entities/conversation.entity';

export type MessageDetail = Message & {
  sender: User;
  conversation: ConversationWithUsers;
};
