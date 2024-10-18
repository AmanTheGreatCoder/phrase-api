/*
  Warnings:

  - The primary key for the `phrases` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `translations` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "translations" DROP CONSTRAINT "translations_phraseId_fkey";

-- AlterTable
ALTER TABLE "phrases" DROP CONSTRAINT "phrases_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "phrases_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "phrases_id_seq";

-- AlterTable
ALTER TABLE "translations" DROP CONSTRAINT "translations_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "phraseId" SET DATA TYPE TEXT,
ADD CONSTRAINT "translations_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "translations_id_seq";

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_phraseId_fkey" FOREIGN KEY ("phraseId") REFERENCES "phrases"("id") ON DELETE CASCADE ON UPDATE CASCADE;
