/*
  Warnings:

  - The primary key for the `EtatEleve` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `EtatEleve` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Classe" DROP CONSTRAINT "Classe_professeurId_fkey";

-- DropIndex
DROP INDEX "public"."Classe_professeurId_idx";

-- DropIndex
DROP INDEX "public"."EtatEleve_eleveId_key";

-- DropIndex
DROP INDEX "public"."EtatEleve_metierId_idx";

-- DropIndex
DROP INDEX "public"."Message_chatroomId_idx";

-- DropIndex
DROP INDEX "public"."Message_senderId_idx";

-- DropIndex
DROP INDEX "public"."Reaction_messageId_idx";

-- DropIndex
DROP INDEX "public"."Reaction_userId_messageId_emoji_key";

-- DropIndex
DROP INDEX "public"."User_classeId_idx";

-- AlterTable
ALTER TABLE "public"."Chatroom" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Classe" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."EtatEleve" DROP CONSTRAINT "EtatEleve_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "EtatEleve_pkey" PRIMARY KEY ("eleveId");

-- AlterTable
ALTER TABLE "public"."Metier" ADD COLUMN     "icon" TEXT;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "role" SET DEFAULT 'ELEVE';

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "professeurId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_SessionParticipants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SessionParticipants_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SessionParticipants_B_index" ON "public"."_SessionParticipants"("B");

-- AddForeignKey
ALTER TABLE "public"."Classe" ADD CONSTRAINT "Classe_professeurId_fkey" FOREIGN KEY ("professeurId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_professeurId_fkey" FOREIGN KEY ("professeurId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_SessionParticipants" ADD CONSTRAINT "_SessionParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_SessionParticipants" ADD CONSTRAINT "_SessionParticipants_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
