/*
  Warnings:

  - A unique constraint covering the columns `[phrase,deleted_at]` on the table `phrases` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "phrases_phrase_key";

-- AlterTable
ALTER TABLE "phrases" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "phrases_phrase_deleted_at_key" ON "phrases"("phrase", "deleted_at");
