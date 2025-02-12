-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "subTitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);
