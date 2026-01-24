/*
  Warnings:

  - You are about to drop the column `closingMessage` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `coverImage` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `emergency` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `sections` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `programId` on the `caregivers` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `caregivers` table. All the data in the column will be lost.
  - You are about to drop the column `regionId` on the `caregivers` table. All the data in the column will be lost.
  - You are about to drop the column `careGiverId` on the `elders` table. All the data in the column will be lost.
  - Added the required column `careRequestId` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `day` on the `schedules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CareType" AS ENUM ('FULL_TIME', 'PART_TIME');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "RequestStatus" ADD VALUE 'CANCELLED';
ALTER TYPE "RequestStatus" ADD VALUE 'EXPIRED';
ALTER TYPE "RequestStatus" ADD VALUE 'COMPLETED';

-- DropForeignKey
ALTER TABLE "caregivers" DROP CONSTRAINT "caregivers_programId_fkey";

-- DropForeignKey
ALTER TABLE "caregivers" DROP CONSTRAINT "caregivers_regionId_fkey";

-- DropForeignKey
ALTER TABLE "elders" DROP CONSTRAINT "elders_careGiverId_fkey";

-- DropIndex
DROP INDEX "care_requests_elderId_caregiverId_key";

-- AlterTable
ALTER TABLE "articles" DROP COLUMN "closingMessage",
DROP COLUMN "coverImage",
DROP COLUMN "emergency",
DROP COLUMN "sections",
DROP COLUMN "summary";

-- AlterTable
ALTER TABLE "care_requests" ADD COLUMN     "careDays" "DayOfWeek"[],
ADD COLUMN     "careType" "CareType" NOT NULL DEFAULT 'PART_TIME',
ADD COLUMN     "expiresAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "caregivers" DROP COLUMN "programId",
DROP COLUMN "region",
DROP COLUMN "regionId",
ADD COLUMN     "languages" TEXT[];

-- AlterTable
ALTER TABLE "elders" DROP COLUMN "careGiverId";

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "categoryColor" TEXT,
ADD COLUMN     "eventUrl" TEXT,
ADD COLUMN     "imageHeight" INTEGER,
ADD COLUMN     "imageSrcset" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "imageWidth" INTEGER,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "postId" TEXT,
ADD COLUMN     "schedule" TEXT,
ADD COLUMN     "scrapedAt" TIMESTAMP(3),
ADD COLUMN     "specialFeatures" TEXT,
ADD COLUMN     "subCategories" TEXT,
ADD COLUMN     "targetAges" TEXT,
ADD COLUMN     "venue" TEXT,
ADD COLUMN     "venueUrl" TEXT;

-- AlterTable
ALTER TABLE "families" ADD COLUMN     "languages" TEXT[],
ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "schedules" ADD COLUMN     "careRequestId" TEXT NOT NULL,
DROP COLUMN "day",
ADD COLUMN     "day" "DayOfWeek" NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "cookiesAccepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "cookiesAcceptedAt" TIMESTAMP(3),
ADD COLUMN     "profilePicture" TEXT;

-- DropEnum
DROP TYPE "Day";

-- CreateTable
CREATE TABLE "content_blocks" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "articleId" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "content_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CaregiverRegions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CaregiverRegions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CareProgramToCaregiver" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CareProgramToCaregiver_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CaregiverRegions_B_index" ON "_CaregiverRegions"("B");

-- CreateIndex
CREATE INDEX "_CareProgramToCaregiver_B_index" ON "_CareProgramToCaregiver"("B");

-- CreateIndex
CREATE INDEX "care_requests_elderId_status_idx" ON "care_requests"("elderId", "status");

-- CreateIndex
CREATE INDEX "elderId_index" ON "care_requests"("elderId");

-- CreateIndex
CREATE INDEX "schedules_careRequestId_idx" ON "schedules"("careRequestId");

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_careRequestId_fkey" FOREIGN KEY ("careRequestId") REFERENCES "care_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_blocks" ADD CONSTRAINT "content_blocks_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_blocks" ADD CONSTRAINT "content_blocks_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "content_blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaregiverRegions" ADD CONSTRAINT "_CaregiverRegions_A_fkey" FOREIGN KEY ("A") REFERENCES "caregivers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaregiverRegions" ADD CONSTRAINT "_CaregiverRegions_B_fkey" FOREIGN KEY ("B") REFERENCES "regions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CareProgramToCaregiver" ADD CONSTRAINT "_CareProgramToCaregiver_A_fkey" FOREIGN KEY ("A") REFERENCES "care_programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CareProgramToCaregiver" ADD CONSTRAINT "_CareProgramToCaregiver_B_fkey" FOREIGN KEY ("B") REFERENCES "caregivers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
