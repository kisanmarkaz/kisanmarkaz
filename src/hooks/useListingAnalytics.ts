import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ListingAnalytics {
  views: number;
  inquiries: number;
  favorites: number;
}

export function useListingAnalytics(listingId: string) {
  const [analytics, setAnalytics] = useState<ListingAnalytics>({
    views: 0,
    inquiries: 0,
    favorites: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        
        // Fetch views
        const { data: viewsData, error: viewsError } = await supabase
          .from('listing_views')
          .select('count')
          .eq('listing_id', listingId)
          .single();
          
        if (viewsError) throw viewsError;

        // Fetch inquiries
        const { data: inquiriesData, error: inquiriesError } = await supabase
          .from('listing_inquiries')
          .select('count')
          .eq('listing_id', listingId)
          .single();
          
        if (inquiriesError) throw inquiriesError;

        // Fetch favorites
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('listing_favorites')
          .select('count')
          .eq('listing_id', listingId)
          .single();
          
        if (favoritesError) throw favoritesError;

        setAnalytics({
          views: viewsData?.count || 0,
          inquiries: inquiriesData?.count || 0,
          favorites: favoritesData?.count || 0
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch analytics'));
      } finally {
        setLoading(false);
      }
    }

    if (listingId) {
      fetchAnalytics();
    }
  }, [listingId]);

  return { analytics, loading, error };
} 