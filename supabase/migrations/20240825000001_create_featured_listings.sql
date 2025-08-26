-- Create featured listings table
CREATE TABLE IF NOT EXISTS featured_listings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    featured_from TIMESTAMP WITH TIME ZONE NOT NULL,
    featured_until TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_type TEXT NOT NULL CHECK (duration_type IN ('day', 'week', 'month')),
    price DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired', 'cancelled')),
    payment_id UUID,
    paddle_transaction_id TEXT,
    UNIQUE(listing_id, featured_from, featured_until)
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    featured_listing_id UUID REFERENCES featured_listings(id) ON DELETE CASCADE,
    paddle_transaction_id TEXT UNIQUE,
    paddle_checkout_id TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled', 'refunded')),
    payment_method TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for better performance
CREATE INDEX idx_featured_listings_listing_id ON featured_listings(listing_id);
CREATE INDEX idx_featured_listings_user_id ON featured_listings(user_id);
CREATE INDEX idx_featured_listings_status ON featured_listings(status);
CREATE INDEX idx_featured_listings_featured_until ON featured_listings(featured_until);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_paddle_transaction_id ON payments(paddle_transaction_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Add RLS policies
ALTER TABLE featured_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Featured listings policies
CREATE POLICY "Users can view their own featured listings" ON featured_listings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own featured listings" ON featured_listings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own featured listings" ON featured_listings
    FOR UPDATE USING (auth.uid() = user_id);

-- Payments policies
CREATE POLICY "Users can view their own payments" ON payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments" ON payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payments" ON payments
    FOR UPDATE USING (auth.uid() = user_id);

-- Add triggers for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_featured_listings_updated_at 
    BEFORE UPDATE ON featured_listings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
