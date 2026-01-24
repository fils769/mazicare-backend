/*
  Warnings:

  - The values [CANCELLED] on the enum `ScheduleStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `careProgram` on the `elders` table. All the data in the column will be lost.
  - You are about to drop the column `day` on the `schedule_items` table. All the data in the column will be lost.
  - You are about to drop the column `elderId` on the `schedule_items` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[scheduleId,startTime]` on the table `schedule_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `scheduleId` to the `schedule_items` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Day" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- AlterEnum
BEGIN;
CREATE TYPE "ScheduleStatus_new" AS ENUM ('PENDING', 'COMPLETED');
ALTER TABLE "public"."schedule_items" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "schedule_items" ALTER COLUMN "status" TYPE "ScheduleStatus_new" USING ("status"::text::"ScheduleStatus_new");
ALTER TYPE "ScheduleStatus" RENAME TO "ScheduleStatus_old";
ALTER TYPE "ScheduleStatus_new" RENAME TO "ScheduleStatus";
DROP TYPE "public"."ScheduleStatus_old";
ALTER TABLE "schedule_items" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "schedule_items" DROP CONSTRAINT "schedule_items_elderId_fkey";

-- DropIndex
DROP INDEX "schedule_items_day_idx";

-- DropIndex
DROP INDEX "schedule_items_elderId_idx";

-- AlterTable
ALTER TABLE "elders" DROP COLUMN "careProgram",
ADD COLUMN     "programId" TEXT;

-- AlterTable
ALTER TABLE "schedule_items" DROP COLUMN "day",
DROP COLUMN "elderId",
ADD COLUMN     "scheduleId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "DayOfWeek";

-- CreateTable
CREATE TABLE "schedules" (
    "id" TEXT NOT NULL,
    "elderId" TEXT NOT NULL,
    "day" "Day" NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "schedules_elderId_idx" ON "schedules"("elderId");

-- CreateIndex
CREATE INDEX "schedule_items_scheduleId_idx" ON "schedule_items"("scheduleId");

-- CreateIndex
CREATE UNIQUE INDEX "schedule_items_scheduleId_startTime_key" ON "schedule_items"("scheduleId", "startTime");

-- AddForeignKey
ALTER TABLE "elders" ADD CONSTRAINT "elders_programId_fkey" FOREIGN KEY ("programId") REFERENCES "care_programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_elderId_fkey" FOREIGN KEY ("elderId") REFERENCES "elders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_items" ADD CONSTRAINT "schedule_items_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
