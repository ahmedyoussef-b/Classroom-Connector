/*
  Warnings:

  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_classeId_fkey";

-- DropIndex
DROP INDEX "public"."Classe_professeurId_idx";

-- DropIndex
DROP INDEX "public"."EtatEleve_metierId_idx";

-- DropIndex
DROP INDEX "public"."Message_chatroomId_idx";

-- DropIndex
DROP INDEX "public"."Message_senderId_idx";

-- DropIndex
DROP INDEX "public"."Reaction_messageId_idx";

-- DropIndex
DROP INDEX "public"."Session_professeurId_idx";

-- DropIndex
DROP INDEX "public"."User_classeId_idx";

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "classeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "public"."Classe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
