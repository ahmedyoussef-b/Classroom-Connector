/*
  Warnings:

  - The primary key for the `EtatEleve` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[eleveId]` on the table `EtatEleve` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,messageId,emoji]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `EtatEleve` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."EtatEleve" DROP CONSTRAINT "EtatEleve_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "EtatEleve_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EtatEleve_eleveId_key" ON "public"."EtatEleve"("eleveId");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_userId_messageId_emoji_key" ON "public"."Reaction"("userId", "messageId", "emoji");
