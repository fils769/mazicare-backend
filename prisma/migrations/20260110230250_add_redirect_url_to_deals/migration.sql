/*
  Warnings:

  - Added the column `redirectUrl` to the `deals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "deals" ADD COLUMN     "redirectUrl" TEXT;
