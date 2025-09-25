-- DropForeignKey
ALTER TABLE "public"."Classe" DROP CONSTRAINT "Classe_chatroomId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Classe" DROP CONSTRAINT "Classe_professeurId_fkey";

-- DropIndex
DROP INDEX "public"."Reaction_userId_messageId_emoji_key";

-- AlterTable
ALTER TABLE "public"."Classe" ALTER COLUMN "chatroomId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."EtatEleve" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Metier" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "public"."Classe" ADD CONSTRAINT "Classe_professeurId_fkey" FOREIGN KEY ("professeurId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Classe" ADD CONSTRAINT "Classe_chatroomId_fkey" FOREIGN KEY ("chatroomId") REFERENCES "public"."Chatroom"("id") ON DELETE SET NULL ON UPDATE CASCADE;
