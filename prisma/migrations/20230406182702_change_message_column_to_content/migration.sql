/*
  Warnings:

  - You are about to drop the column `type` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `Message` table. All the data in the column will be lost.
  - Added the required column `content` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Made the column `conversationId` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_conversationId_fkey";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "message",
ADD COLUMN     "content" TEXT NOT NULL,
ALTER COLUMN "conversationId" SET NOT NULL;

-- DropEnum
DROP TYPE "ConversationType";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
