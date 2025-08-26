-- Function to check and expire featured listings
CREATE OR REPLACE FUNCTION expire_featured_listings()
RETURNS void AS $$
BEGIN
    -- Update expired featured listings
    UPDATE featured_listings 
    SET status = 'expired'
    WHERE status = 'active' 
    AND featured_until < timezone('utc'::text, now());
    
    -- Log the number of expired listings
    RAISE NOTICE 'Expired % featured listings', (
        SELECT COUNT(*) 
        FROM featured_listings 
        WHERE status = 'expired' 
        AND updated_at = timezone('utc'::text, now())
    );
END;
$$ LANGUAGE plpgsql;

-- Create a view to get currently featured listings
CREATE OR REPLACE VIEW active_featured_listings AS
SELECT 
    fl.*,
    l.title,
    l.price,
    l.images,
    l.category_id,
    l.location_city,
    l.location_province
FROM featured_listings fl
JOIN listings l ON fl.listing_id = l.id
WHERE fl.status = 'active'
AND fl.featured_from <= timezone('utc'::text, now())
AND fl.featured_until > timezone('utc'::text, now())
ORDER BY fl.created_at DESC;

-- Grant permissions
GRANT SELECT ON active_featured_listings TO authenticated;
GRANT EXECUTE ON FUNCTION expire_featured_listings() TO service_role;

-- Optional: Set up a cron job (requires pg_cron extension)
-- This would run every hour to check for expired featured listings
-- SELECT cron.schedule('expire-featured-listings', '0 * * * *', 'SELECT expire_featured_listings();');
