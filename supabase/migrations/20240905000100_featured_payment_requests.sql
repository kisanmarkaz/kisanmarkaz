-- Manual Featured Listing Payment Requests
-- Creates request table and storage bucket policies for proof uploads

-- Requests table
CREATE TABLE IF NOT EXISTS featured_payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('day','week','month')),
  proof_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  admin_note TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  featured_from TIMESTAMPTZ,
  featured_until TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_fpr_user ON featured_payment_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_fpr_listing ON featured_payment_requests(listing_id);
CREATE INDEX IF NOT EXISTS idx_fpr_status ON featured_payment_requests(status);

ALTER TABLE featured_payment_requests ENABLE ROW LEVEL SECURITY;

-- RLS: users manage their own requests
CREATE POLICY "fpr_select_own" ON featured_payment_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "fpr_insert_own" ON featured_payment_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "fpr_update_own_pending" ON featured_payment_requests
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Admin access: replace with your admin check as needed; default allow service role
-- If you use a dedicated admin role, add policies accordingly.

-- Trigger to keep updated_at fresh
CREATE OR REPLACE FUNCTION fpr_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS fpr_updated_at ON featured_payment_requests;
CREATE TRIGGER fpr_updated_at BEFORE UPDATE ON featured_payment_requests
FOR EACH ROW EXECUTE FUNCTION fpr_set_updated_at();


