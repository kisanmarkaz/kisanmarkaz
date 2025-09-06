-- Add user_email column to featured_payment_requests for notifications
ALTER TABLE featured_payment_requests
ADD COLUMN IF NOT EXISTS user_email TEXT;

CREATE INDEX IF NOT EXISTS idx_fpr_user_email ON featured_payment_requests(user_email);

