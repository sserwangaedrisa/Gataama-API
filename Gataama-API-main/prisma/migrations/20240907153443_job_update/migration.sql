-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "deadline" TIMESTAMP(3),
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;
