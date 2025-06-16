import React from 'react';
import { useListingAnalytics } from '@/hooks/useListingAnalytics';
import { EyeIcon, MousePointerClick, PhoneCall, MessageSquare } from 'lucide-react';

interface ListingAnalyticsProps {
  listingId: string;
}

export function ListingAnalytics({ listingId }: ListingAnalyticsProps) {
  const { analytics, loading, error } = useListingAnalytics(listingId);

  if (loading) {
    return (
      <div className="flex gap-4 animate-pulse">
        <div className="h-8 w-20 bg-gray-200 rounded"></div>
        <div className="h-8 w-20 bg-gray-200 rounded"></div>
        <div className="h-8 w-20 bg-gray-200 rounded"></div>
        <div className="h-8 w-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm">
        Failed to load analytics
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      <div className="flex items-center gap-2">
        <EyeIcon className="h-5 w-5 text-gray-500" />
        <span className="text-sm font-medium">{analytics.impressions} impressions</span>
      </div>
      
      <div className="flex items-center gap-2">
        <MousePointerClick className="h-5 w-5 text-gray-500" />
        <span className="text-sm font-medium">{analytics.clicks} clicks</span>
      </div>
      
      <div className="flex items-center gap-2">
        <PhoneCall className="h-5 w-5 text-gray-500" />
        <span className="text-sm font-medium">{analytics.phone_views} phone views</span>
      </div>

      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-gray-500" />
        <span className="text-sm font-medium">{analytics.messages_sent} messages</span>
      </div>
    </div>
  );
} 