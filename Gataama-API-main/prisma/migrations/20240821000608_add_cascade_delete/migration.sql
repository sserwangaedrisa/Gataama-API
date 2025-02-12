-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "Department" DROP CONSTRAINT "Department_countryId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_postId_fkey";

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
