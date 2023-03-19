/*
  Warnings:

  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "password";

-- CreateTable
CREATE TABLE "UserCredentials" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserCredentials_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserCredentials" ADD CONSTRAINT "UserCredentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
