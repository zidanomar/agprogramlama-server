import { ConversationType, User } from '@prisma/client';

export class CreateConversationDto {
  sender: User;
  receiver: User;
  type = 'PERSONAL' as ConversationType;
}
