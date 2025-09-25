/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Classe` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Classe` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[emoji,userId,messageId]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.
  - Made the column `professeurId` on table `Classe` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Classe" DROP CONSTRAINT "Classe_professeurId_fkey";

-- DropIndex
DROP INDEX "public"."Classe_professeurId_key";

-- AlterTable
ALTER TABLE "public"."Classe" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "professeurId" SET NOT NULL,
ALTER COLUMN "chatroomId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Reaction" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "role" DROP DEFAULT;

-- CreateTable
CREATE TABLE "public"."Chatroom" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Chatroom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_emoji_userId_messageId_key" ON "public"."Reaction"("emoji", "userId", "messageId");

-- AddForeignKey
ALTER TABLE "public"."Classe" ADD CONSTRAINT "Classe_professeurId_fkey" FOREIGN KEY ("professeurId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Classe" ADD CONSTRAINT "Classe_chatroomId_fkey" FOREIGN KEY ("chatroomId") REFERENCES "public"."Chatroom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_chatroomId_fkey" FOREIGN KEY ("chatroomId") REFERENCES "public"."Chatroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reaction" ADD CONSTRAINT "Reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
