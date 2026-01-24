-- Add phone number support to users table
ALTER TABLE "users" ADD COLUMN "phoneNumber" TEXT;
ALTER TABLE "users" ADD COLUMN "phoneVerified" BOOLEAN NOT NULL DEFAULT false;

-- Make email nullable since users can sign up with phone
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;

-- Add unique constraint on phoneNumber
CREATE UNIQUE INDEX "users_phoneNumber_key" ON "users"("phoneNumber") WHERE "phoneNumber" IS NOT NULL;

-- Add phone number and identifier to otps table
ALTER TABLE "otps" ADD COLUMN "phoneNumber" TEXT;
ALTER TABLE "otps" ADD COLUMN "identifier" TEXT;

-- Make email nullable in otps since we can use phone
ALTER TABLE "otps" ALTER COLUMN "email" DROP NOT NULL;

-- Drop the old foreign key constraint
ALTER TABLE "otps" DROP CONSTRAINT "otps_email_fkey";

-- Add index on identifier for faster lookups
CREATE INDEX "otps_identifier_idx" ON "otps"("identifier");
