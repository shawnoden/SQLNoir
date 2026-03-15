CREATE TABLE IF NOT EXISTS pending_licenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  stripe_session_id TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  claimed_at TIMESTAMPTZ,
  claimed_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_pending_licenses_session ON pending_licenses(stripe_session_id) WHERE claimed_at IS NULL;
