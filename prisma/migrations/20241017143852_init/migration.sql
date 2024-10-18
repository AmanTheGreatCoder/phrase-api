-- CreateTable
CREATE TABLE "Phrase" (
    "id" SERIAL NOT NULL,
    "phrase" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "translations" JSONB NOT NULL,

    CONSTRAINT "Phrase_pkey" PRIMARY KEY ("id")
);
