import { ConversationType } from '@prisma/client';

export class CreateConversationDto {
  senderId: string;
  receiverIds: string[];
  name?: string;
  type: ConversationType;
}
