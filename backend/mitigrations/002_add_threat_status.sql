-- Add status column to Threat_Alert table (if it doesn't exist)
-- Run this only if the column doesn't exist yet
-- If you get an error that column already exists, you can ignore it

ALTER TABLE Threat_Alert 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';

-- Add action column to Threat_Alert table (if it doesn't exist)
ALTER TABLE Threat_Alert 
ADD COLUMN IF NOT EXISTS action TEXT;

-- Update existing records to have 'active' status if status is NULL
UPDATE Threat_Alert 
SET status = 'active' 
WHERE status IS NULL;

