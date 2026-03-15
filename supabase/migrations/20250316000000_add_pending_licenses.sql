CREATE TABLE IF NOT EXISTS pending_licenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  stripe_session_id TEXT NOT NULL,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  claimed_at TIMESTAMPTZ,
  claimed_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_pending_licenses_email ON pending_licenses(email);
CREATE INDEX idx_pending_licenses_unclaimed ON pending_licenses(email) WHERE claimed_at IS NULL;
