/*
  Warnings:

  - You are about to drop the column `createdAt` on the `phrases` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `phrases` table. All the data in the column will be lost.
  - You are about to drop the column `phraseId` on the `translations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phrase]` on the table `phrases` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phrase_id,language]` on the table `translations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phrase_id` to the `translations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "translations" DROP CONSTRAINT "translations_phraseId_fkey";

-- DropIndex
DROP INDEX "phrases_createdAt_idx";

-- DropIndex
DROP INDEX "translations_phraseId_language_key";

-- AlterTable
ALTER TABLE "phrases" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "translations" DROP COLUMN "phraseId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "phrase_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "phrases_phrase_key" ON "phrases"("phrase");

-- CreateIndex
CREATE INDEX "phrases_created_at_idx" ON "phrases"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "translations_phrase_id_language_key" ON "translations"("phrase_id", "language");

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_phrase_id_fkey" FOREIGN KEY ("phrase_id") REFERENCES "phrases"("id") ON DELETE CASCADE ON UPDATE CASCADE;
