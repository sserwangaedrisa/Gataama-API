-- CreateTable
CREATE TABLE "_CountryAdmins" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CountryAdmins_AB_unique" ON "_CountryAdmins"("A", "B");

-- CreateIndex
CREATE INDEX "_CountryAdmins_B_index" ON "_CountryAdmins"("B");

-- AddForeignKey
ALTER TABLE "_CountryAdmins" ADD CONSTRAINT "_CountryAdmins_A_fkey" FOREIGN KEY ("A") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CountryAdmins" ADD CONSTRAINT "_CountryAdmins_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
