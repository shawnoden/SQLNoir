-- Add has_license flag to user_info for Detective License paywall
ALTER TABLE user_info ADD COLUMN IF NOT EXISTS has_license boolean DEFAULT false;
