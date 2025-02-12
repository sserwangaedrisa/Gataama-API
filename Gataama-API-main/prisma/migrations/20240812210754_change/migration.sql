-- DropForeignKey
ALTER TABLE "DepartmentPost" DROP CONSTRAINT "DepartmentPost_departmentId_fkey";

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "content" TEXT,
ADD COLUMN     "title" TEXT;
