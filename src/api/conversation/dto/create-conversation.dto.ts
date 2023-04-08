import { ConversationType, User } from '@prisma/client';

export class CreateConversationDto {
  sender: User;
  receivers: User[];
  name?: string;
  type: ConversationType;
}
