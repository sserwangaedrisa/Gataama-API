-- DropForeignKey
ALTER TABLE "team_members" DROP CONSTRAINT "team_members_countryId_fkey";

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "isMain" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "team_members" ADD COLUMN     "isMain" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "countryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
