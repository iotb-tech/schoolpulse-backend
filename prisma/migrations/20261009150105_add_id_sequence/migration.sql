-- CreateTable
CREATE TABLE "IdSequence" (
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "IdSequence_pkey" PRIMARY KEY ("name")
);
