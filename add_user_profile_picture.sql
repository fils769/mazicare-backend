-- Migration: Add profilePicture to User table
-- This allows admin users to have profile pictures

-- Add profilePicture column to users table
ALTER TABLE "users" ADD COLUMN "profilePicture" TEXT;

-- This column is nullable, so existing users are not affected
-- Admin users can now upload and update their profile pictures
-- The column will store the UploadThing URL for the profile picture
