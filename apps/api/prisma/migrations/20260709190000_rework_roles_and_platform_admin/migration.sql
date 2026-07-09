-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('PLATFORM_ADMIN', 'SCHOOL_ADMIN', 'FINANCE_OFFICER', 'TEACHER', 'ADMISSIONS_OFFICER');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_schoolId_fkey";

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "address" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "schoolId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "User_schoolId_idx" ON "User"("schoolId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;
