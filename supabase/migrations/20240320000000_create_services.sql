-- Create service_types enum
CREATE TYPE service_type AS ENUM (
  'tractor_rental',
  'spraying',
  'labor',
  'land_preparation',
  'water_boring',
  'harvesting',
  'transportation',
  'consultancy',
  'other'
);

-- Create price_unit enum
CREATE TYPE price_unit AS ENUM (
  'per_hour',
  'per_acre',
  'per_day',
  'fixed'
);

-- Create services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  service_type service_type NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  price_unit price_unit NOT NULL,
  negotiable BOOLEAN NOT NULL DEFAULT FALSE,
  location_city TEXT NOT NULL,
  location_province TEXT NOT NULL,
  location_address TEXT,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  images TEXT[],
  status TEXT NOT NULL DEFAULT 'active',
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  views_count INTEGER NOT NULL DEFAULT 0
);

-- Add RLS policies
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Policy for viewing services
CREATE POLICY "Services are viewable by everyone" ON services
  FOR SELECT
  USING (true);

-- Policy for inserting services
CREATE POLICY "Users can create services" ON services
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy for updating services
CREATE POLICY "Users can update their own services" ON services
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for deleting services
CREATE POLICY "Users can delete their own services" ON services
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER set_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime (updated_at);

-- Create index for common queries
CREATE INDEX services_service_type_idx ON services (service_type);
CREATE INDEX services_location_province_idx ON services (location_province);
CREATE INDEX services_user_id_idx ON services (user_id);
CREATE INDEX services_created_at_idx ON services (created_at DESC);
CREATE INDEX services_featured_idx ON services (featured) WHERE featured = true; 