/*
  Warnings:

  - You are about to drop the column `languages` on the `families` table. All the data in the column will be lost.
  - You are about to drop the column `cookiesAccepted` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `cookiesAcceptedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `_CaregiverRegions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `identifier` on table `otps` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "OtpType" ADD VALUE 'SIGNUP';

-- DropForeignKey
ALTER TABLE "_CaregiverRegions" DROP CONSTRAINT "_CaregiverRegions_A_fkey";

-- DropForeignKey
ALTER TABLE "_CaregiverRegions" DROP CONSTRAINT "_CaregiverRegions_B_fkey";

-- DropIndex (if exists)
DROP INDEX IF EXISTS "otps_identifier_idx";

-- AlterTable
ALTER TABLE "care_requests" ALTER COLUMN "careType" DROP DEFAULT;

-- AlterTable
ALTER TABLE "caregivers" ADD COLUMN     "certificates" TEXT[],
ADD COLUMN     "idPassportPhoto" TEXT,
ADD COLUMN     "recommendationLetter" TEXT,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "regionId" TEXT;

-- AlterTable
ALTER TABLE "families" DROP COLUMN "languages";

-- AlterTable
ALTER TABLE "otps" ALTER COLUMN "identifier" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "cookiesAccepted",
DROP COLUMN "cookiesAcceptedAt",
ALTER COLUMN "email" SET NOT NULL;

-- DropTable
DROP TABLE "_CaregiverRegions";

-- CreateIndex
CREATE INDEX "care_requests_caregiverId_idx" ON "care_requests"("caregiverId");

-- CreateIndex
CREATE INDEX "care_requests_familyId_idx" ON "care_requests"("familyId");

-- CreateIndex
CREATE INDEX "care_requests_status_idx" ON "care_requests"("status");

-- CreateIndex
CREATE INDEX "care_requests_elderId_caregiverId_status_idx" ON "care_requests"("elderId", "caregiverId", "status");

-- CreateIndex (if not exists)
CREATE UNIQUE INDEX IF NOT EXISTS "users_phoneNumber_key" ON "users"("phoneNumber");

-- AddForeignKey
ALTER TABLE "otps" ADD CONSTRAINT "otps_email_fkey" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caregivers" ADD CONSTRAINT "caregivers_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
