/*
  Warnings:

  - Made the column `lastMessageAt` on table `Conversation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Conversation" ALTER COLUMN "lastMessageAt" SET NOT NULL,
ALTER COLUMN "lastMessageAt" SET DEFAULT CURRENT_TIMESTAMP;
