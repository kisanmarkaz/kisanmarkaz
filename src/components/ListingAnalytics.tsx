import React from 'react';
import { useListingAnalytics } from '@/hooks/useListingAnalytics';
import { EyeIcon, ChatBubbleLeftIcon, HeartIcon } from '@heroicons/react/24/outline';

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
        <span className="text-sm font-medium">{analytics.views} views</span>
      </div>
      
      <div className="flex items-center gap-2">
        <ChatBubbleLeftIcon className="h-5 w-5 text-gray-500" />
        <span className="text-sm font-medium">{analytics.inquiries} inquiries</span>
      </div>
      
      <div className="flex items-center gap-2">
        <HeartIcon className="h-5 w-5 text-gray-500" />
        <span className="text-sm font-medium">{analytics.favorites} favorites</span>
      </div>
    </div>
  );
} 