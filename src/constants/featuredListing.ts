export const FEATURED_PRICING = {
  day: {
    price: 3,
    duration: 1,
    unit: 'day' as const,
    label: '1 Day',
    description: 'Feature your listing for 24 hours'
  },
  week: {
    price: 15,
    duration: 7,
    unit: 'week' as const,
    label: '1 Week',
    description: 'Feature your listing for 7 days'
  },
  month: {
    price: 30,
    duration: 30,
    unit: 'month' as const,
    label: '1 Month',
    description: 'Feature your listing for 30 days'
  }
} as const;

export type FeaturedDuration = keyof typeof FEATURED_PRICING;

export interface FeaturedListingOption {
  price: number;
  duration: number;
  unit: 'day' | 'week' | 'month';
  label: string;
  description: string;
}

export const getFeaturedPricingOptions = (): Array<FeaturedListingOption & { key: FeaturedDuration }> => {
  return Object.entries(FEATURED_PRICING).map(([key, value]) => ({
    key: key as FeaturedDuration,
    ...value
  }));
};

export const calculateFeaturedEndDate = (duration: FeaturedDuration, startDate: Date = new Date()): Date => {
  const option = FEATURED_PRICING[duration];
  const endDate = new Date(startDate);
  
  switch (option.unit) {
    case 'day':
      endDate.setDate(endDate.getDate() + option.duration);
      break;
    case 'week':
      endDate.setDate(endDate.getDate() + (option.duration * 7));
      break;
    case 'month':
      endDate.setMonth(endDate.getMonth() + option.duration);
      break;
  }
  
  return endDate;
};

export const getFeaturedPrice = (duration: FeaturedDuration): number => {
  return FEATURED_PRICING[duration].price;
};

export const isFeaturedActive = (featuredFrom: Date, featuredUntil: Date, now: Date = new Date()): boolean => {
  return now >= featuredFrom && now <= featuredUntil;
};

export const getFeaturedStatus = (
  featuredFrom: Date, 
  featuredUntil: Date, 
  paymentStatus: 'pending' | 'completed' | 'failed' | 'cancelled',
  now: Date = new Date()
): 'pending' | 'active' | 'expired' | 'cancelled' => {
  if (paymentStatus === 'failed' || paymentStatus === 'cancelled') {
    return 'cancelled';
  }
  
  if (paymentStatus === 'pending') {
    return 'pending';
  }
  
  if (now > featuredUntil) {
    return 'expired';
  }
  
  return 'active';
};

export const formatFeaturedDuration = (duration: FeaturedDuration): string => {
  const option = FEATURED_PRICING[duration];
  return `${option.duration} ${option.unit}${option.duration > 1 ? 's' : ''}`;
};

// Paddle removed. No payment gateway config required for manual verification flow.
