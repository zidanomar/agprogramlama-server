/*
  Warnings:

  - You are about to drop the column `ConversationId` on the `Message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_ConversationId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "ConversationId",
ADD COLUMN     "conversationId" TEXT;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
