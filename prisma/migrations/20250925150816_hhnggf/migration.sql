/*
  Warnings:

  - A unique constraint covering the columns `[userId,messageId,emoji]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.
  - Made the column `chatroomId` on table `Classe` required. This step will fail if there are existing NULL values in that column.
  - Made the column `classeId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Classe" DROP CONSTRAINT "Classe_chatroomId_fkey";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_classeId_fkey";

-- AlterTable
ALTER TABLE "public"."Chatroom" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."Classe" ALTER COLUMN "chatroomId" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."EtatEleve" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."Metier" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'ELEVE',
ALTER COLUMN "classeId" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "Classe_professeurId_idx" ON "public"."Classe"("professeurId");

-- CreateIndex
CREATE INDEX "EtatEleve_metierId_idx" ON "public"."EtatEleve"("metierId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "public"."Message"("senderId");

-- CreateIndex
CREATE INDEX "Message_chatroomId_idx" ON "public"."Message"("chatroomId");

-- CreateIndex
CREATE INDEX "Reaction_messageId_idx" ON "public"."Reaction"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_userId_messageId_emoji_key" ON "public"."Reaction"("userId", "messageId", "emoji");

-- CreateIndex
CREATE INDEX "Session_professeurId_idx" ON "public"."Session"("professeurId");

-- CreateIndex
CREATE INDEX "User_classeId_idx" ON "public"."User"("classeId");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "public"."Classe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Classe" ADD CONSTRAINT "Classe_chatroomId_fkey" FOREIGN KEY ("chatroomId") REFERENCES "public"."Chatroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
