/*
  Warnings:

  - A unique constraint covering the columns `[userId,messageId,emoji]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.
  - Made the column `chatroomId` on table `Classe` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Classe" DROP CONSTRAINT "Classe_chatroomId_fkey";

-- DropIndex
DROP INDEX "public"."Reaction_emoji_userId_messageId_key";

-- AlterTable
ALTER TABLE "public"."Classe" ALTER COLUMN "chatroomId" SET NOT NULL;

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
CREATE INDEX "User_classeId_idx" ON "public"."User"("classeId");

-- AddForeignKey
ALTER TABLE "public"."Classe" ADD CONSTRAINT "Classe_chatroomId_fkey" FOREIGN KEY ("chatroomId") REFERENCES "public"."Chatroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
