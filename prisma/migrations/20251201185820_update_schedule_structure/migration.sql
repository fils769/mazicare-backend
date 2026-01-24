/*
  Warnings:

  - You are about to drop the column `careProgramm` on the `elders` table. All the data in the column will be lost.
  - Added the required column `day` to the `schedule_items` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- DropForeignKey
ALTER TABLE "elders" DROP CONSTRAINT "elders_familyId_fkey";

-- DropForeignKey
ALTER TABLE "schedule_items" DROP CONSTRAINT "schedule_items_elderId_fkey";

-- AlterTable
ALTER TABLE "elders" DROP COLUMN "careProgramm",
ADD COLUMN     "careProgram" TEXT;

-- AlterTable
ALTER TABLE "schedule_items" ADD COLUMN     "day" "DayOfWeek" NOT NULL,
ALTER COLUMN "startTime" SET DATA TYPE TEXT,
ALTER COLUMN "endTime" SET DATA TYPE TEXT;

-- CreateIndex
CREATE INDEX "schedule_items_elderId_idx" ON "schedule_items"("elderId");

-- CreateIndex
CREATE INDEX "schedule_items_day_idx" ON "schedule_items"("day");

-- AddForeignKey
ALTER TABLE "elders" ADD CONSTRAINT "elders_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_items" ADD CONSTRAINT "schedule_items_elderId_fkey" FOREIGN KEY ("elderId") REFERENCES "elders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
