-- Add action column to Threat_Alert table if it doesn't exist
-- This migration adds the action column that was missing from the original table

-- For MySQL versions that don't support IF NOT EXISTS, use this:
-- First check if column exists, then add it
-- Or simply run: ALTER TABLE Threat_Alert ADD COLUMN action TEXT;

-- Note: If you get an error that column already exists, you can ignore it
ALTER TABLE Threat_Alert ADD COLUMN action TEXT;

