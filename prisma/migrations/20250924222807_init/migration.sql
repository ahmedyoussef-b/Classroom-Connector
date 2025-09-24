-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ELEVE', 'PROFESSEUR');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "role" "public"."Role" NOT NULL DEFAULT 'ELEVE',
    "ambition" TEXT,
    "classeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Classe" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "professeurId" TEXT,
    "chatroomId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Classe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EtatEleve" (
    "id" TEXT NOT NULL,
    "eleveId" TEXT NOT NULL,
    "metierId" TEXT,
    "isPunished" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EtatEleve_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Metier" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "theme" JSONB NOT NULL,

    CONSTRAINT "Metier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Message" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "senderName" TEXT NOT NULL,
    "chatroomId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Reaction" (
    "id" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Classe_professeurId_key" ON "public"."Classe"("professeurId");

-- CreateIndex
CREATE UNIQUE INDEX "Classe_chatroomId_key" ON "public"."Classe"("chatroomId");

-- CreateIndex
CREATE UNIQUE INDEX "EtatEleve_eleveId_key" ON "public"."EtatEleve"("eleveId");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "public"."Classe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Classe" ADD CONSTRAINT "Classe_professeurId_fkey" FOREIGN KEY ("professeurId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EtatEleve" ADD CONSTRAINT "EtatEleve_eleveId_fkey" FOREIGN KEY ("eleveId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EtatEleve" ADD CONSTRAINT "EtatEleve_metierId_fkey" FOREIGN KEY ("metierId") REFERENCES "public"."Metier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reaction" ADD CONSTRAINT "Reaction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "public"."Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
