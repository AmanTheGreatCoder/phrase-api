/*
  Warnings:

  - You are about to drop the `Phrase` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'pending', 'spam', 'deleted');

-- DropTable
DROP TABLE "Phrase";

-- CreateTable
CREATE TABLE "phrases" (
    "id" SERIAL NOT NULL,
    "phrase" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "phrases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translations" (
    "id" SERIAL NOT NULL,
    "phraseId" INTEGER NOT NULL,
    "language" VARCHAR(2) NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);


-- CreateIndex
CREATE INDEX "phrases_status_idx" ON "phrases"("status");

-- CreateIndex
CREATE INDEX "phrases_createdAt_idx" ON "phrases"("createdAt");

-- CreateIndex
CREATE INDEX "translations_language_idx" ON "translations"("language");

-- CreateIndex
CREATE UNIQUE INDEX "translations_phraseId_language_key" ON "translations"("phraseId", "language");

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_phraseId_fkey" FOREIGN KEY ("phraseId") REFERENCES "phrases"("id") ON DELETE CASCADE ON UPDATE CASCADE;
