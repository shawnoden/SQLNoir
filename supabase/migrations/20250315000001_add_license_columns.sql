-- Add has_license flag to user_info table
ALTER TABLE user_info ADD COLUMN IF NOT EXISTS has_license boolean DEFAULT false;
ALTER TABLE user_info ADD COLUMN IF NOT EXISTS license_purchased_at timestamptz;
ALTER TABLE user_info ADD COLUMN IF NOT EXISTS stripe_customer_id text;
ALTER TABLE user_info ADD COLUMN IF NOT EXISTS stripe_session_id text;
