-- CreateTable
CREATE TABLE "team_members" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "profilePicture" TEXT,
    "linkedin" TEXT,
    "facebook" TEXT,
    "twitter" TEXT,
    "youtube" TEXT,
    "description" TEXT,
    "countryId" INTEGER NOT NULL,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
