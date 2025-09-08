-- Add missing email verification columns to users table
-- Run this SQL script in your PostgreSQL database

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS "isEmailVerified" boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS "emailVerificationToken" varchar,
ADD COLUMN IF NOT EXISTS "emailVerificationExpires" timestamp;

-- Update existing users to have email verified as true (optional)
-- Uncomment the line below if you want existing users to be able to login immediately
-- UPDATE users SET "isEmailVerified" = true WHERE "isEmailVerified" IS NULL OR "isEmailVerified" = false;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('isEmailVerified', 'emailVerificationToken', 'emailVerificationExpires')
ORDER BY column_name;
