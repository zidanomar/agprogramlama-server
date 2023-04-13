import { Conversation, Message, User } from '@prisma/client';

export type ConversationDetail = Conversation & {
  users: User[];
  messages: Message[];
};

export type ConversationWithUsers = Conversation & {
  users: User[];
};
