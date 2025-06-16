import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ListingAnalytics {
  impressions: number;
  clicks: number;
  phone_views: number;
  messages_sent: number;
}

// Helper function to increment a specific metric
async function incrementMetric(listingId: string, metric: keyof ListingAnalytics) {
  const { data, error } = await supabase.rpc('increment_listing_analytics', {
    p_listing_id: listingId,
    p_metric: metric
  });
  
  if (error) {
    console.error(`Error incrementing ${metric}:`, error);
    throw error;
  }
  
  return data;
}

export function useListingAnalytics(listingId: string) {
  const [analytics, setAnalytics] = useState<ListingAnalytics>({
    impressions: 0,
    clicks: 0,
    phone_views: 0,
    messages_sent: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        
        // Fetch analytics from the consolidated listing_analytics table
        const { data, error } = await supabase
          .from('listing_analytics')
          .select('*')
          .eq('listing_id', listingId)
          .single();
          
        if (error && error.code !== 'PGRST116') { // Ignore "no rows returned" error
          throw error;
        }

        // If no data exists yet, create initial analytics record
        if (!data) {
          const { error: insertError } = await supabase
            .from('listing_analytics')
            .insert({
              listing_id: listingId,
              impressions: 0,
              clicks: 0,
              phone_views: 0,
              messages_sent: 0
            });

          if (insertError) throw insertError;

          setAnalytics({
            impressions: 0,
            clicks: 0,
            phone_views: 0,
            messages_sent: 0
          });
        } else {
          setAnalytics({
            impressions: data.impressions || 0,
            clicks: data.clicks || 0,
            phone_views: data.phone_views || 0,
            messages_sent: data.messages_sent || 0
          });
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch analytics'));
      } finally {
        setLoading(false);
      }
    }

    if (listingId) {
      fetchAnalytics();
    }
  }, [listingId]);

  // Track impression when the listing is viewed
  useEffect(() => {
    if (listingId) {
      incrementMetric(listingId, 'impressions').catch(console.error);
    }
  }, [listingId]);

  // Functions to track other metrics
  const trackClick = async () => {
    if (listingId) {
      await incrementMetric(listingId, 'clicks');
      setAnalytics(prev => ({ ...prev, clicks: prev.clicks + 1 }));
    }
  };

  const trackPhoneView = async () => {
    if (listingId) {
      await incrementMetric(listingId, 'phone_views');
      setAnalytics(prev => ({ ...prev, phone_views: prev.phone_views + 1 }));
    }
  };

  const trackMessage = async () => {
    if (listingId) {
      await incrementMetric(listingId, 'messages_sent');
      setAnalytics(prev => ({ ...prev, messages_sent: prev.messages_sent + 1 }));
    }
  };

  return { 
    analytics, 
    loading, 
    error,
    trackClick,
    trackPhoneView,
    trackMessage
  };
} 