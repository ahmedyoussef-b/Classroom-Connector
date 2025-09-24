-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('PROFESSEUR', 'ELEVE');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "public"."Role" NOT NULL DEFAULT 'ELEVE',
    "classeId" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."classes" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "professeurId" TEXT NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."metiers" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "theme" JSONB NOT NULL,

    CONSTRAINT "metiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."etats_eleves" (
    "id" TEXT NOT NULL,
    "eleveId" TEXT NOT NULL,
    "metierId" TEXT,
    "estPuni" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "etats_eleves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chatrooms" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "classeId" TEXT NOT NULL,

    CONSTRAINT "chatrooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."messages" (
    "id" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "envoyeA" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "auteurId" TEXT NOT NULL,
    "chatroomId" TEXT NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reactions" (
    "id" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "auteurId" TEXT NOT NULL,

    CONSTRAINT "reactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "classes_professeurId_key" ON "public"."classes"("professeurId");

-- CreateIndex
CREATE UNIQUE INDEX "etats_eleves_eleveId_key" ON "public"."etats_eleves"("eleveId");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "public"."classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."classes" ADD CONSTRAINT "classes_professeurId_fkey" FOREIGN KEY ("professeurId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."etats_eleves" ADD CONSTRAINT "etats_eleves_eleveId_fkey" FOREIGN KEY ("eleveId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."etats_eleves" ADD CONSTRAINT "etats_eleves_metierId_fkey" FOREIGN KEY ("metierId") REFERENCES "public"."metiers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chatrooms" ADD CONSTRAINT "chatrooms_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "public"."classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_auteurId_fkey" FOREIGN KEY ("auteurId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_chatroomId_fkey" FOREIGN KEY ("chatroomId") REFERENCES "public"."chatrooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reactions" ADD CONSTRAINT "reactions_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "public"."messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reactions" ADD CONSTRAINT "reactions_auteurId_fkey" FOREIGN KEY ("auteurId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
