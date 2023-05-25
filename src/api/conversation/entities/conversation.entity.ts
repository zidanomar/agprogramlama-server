import { Conversation, Message, User } from '@prisma/client';

export type ConversationDetail = Conversation & {
  users: User[];
  messages: Message[];
  unseenMessages: number;
};

export type ConversationWithUsers = Conversation & {
  users: User[];
};
