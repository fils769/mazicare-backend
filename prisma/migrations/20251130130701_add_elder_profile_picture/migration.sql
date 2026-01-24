/*
  Warnings:

  - You are about to drop the column `location` on the `caregivers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "caregivers" DROP COLUMN "location";

-- AlterTable
ALTER TABLE "elders" ADD COLUMN     "profilePicture" TEXT;
