-- CreateTable
CREATE TABLE "country_contacts" (
    "id" SERIAL NOT NULL,
    "location" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "countryId" INTEGER NOT NULL,

    CONSTRAINT "country_contacts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "country_contacts" ADD CONSTRAINT "country_contacts_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
