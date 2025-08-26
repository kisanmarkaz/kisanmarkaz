import React from 'react';
import { Star, Crown, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FeaturedListingBadgeProps {
  variant?: 'small' | 'medium' | 'large';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'inline';
  className?: string;
  showText?: boolean;
}

const FeaturedListingBadge: React.FC<FeaturedListingBadgeProps> = ({
  variant = 'medium',
  position = 'top-right',
  className,
  showText = true
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'small':
        return <Star className="h-3 w-3" fill="currentColor" />;
      case 'large':
        return <Crown className="h-5 w-5" fill="currentColor" />;
      default:
        return <Sparkles className="h-4 w-4" fill="currentColor" />;
    }
  };

  const getSize = () => {
    switch (variant) {
      case 'small':
        return 'text-xs px-1.5 py-0.5';
      case 'large':
        return 'text-sm px-3 py-1.5';
      default:
        return 'text-xs px-2 py-1';
    }
  };

  const getPositionClasses = () => {
    if (position === 'inline') return '';
    
    const baseClasses = 'absolute z-10';
    switch (position) {
      case 'top-left':
        return `${baseClasses} top-2 left-2`;
      case 'top-right':
        return `${baseClasses} top-2 right-2`;
      case 'bottom-left':
        return `${baseClasses} bottom-2 left-2`;
      case 'bottom-right':
        return `${baseClasses} bottom-2 right-2`;
      default:
        return `${baseClasses} top-2 right-2`;
    }
  };

  return (
    <Badge 
      className={cn(
        'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white border-yellow-300 shadow-lg',
        'hover:from-yellow-500 hover:to-yellow-700 transition-all duration-200',
        'animate-pulse',
        getSize(),
        getPositionClasses(),
        className
      )}
    >
      {getIcon()}
      {showText && <span className="ml-1 font-semibold">Featured</span>}
    </Badge>
  );
};

interface FeaturedListingCardWrapperProps {
  children: React.ReactNode;
  isFeatured: boolean;
  className?: string;
}

export const FeaturedListingCardWrapper: React.FC<FeaturedListingCardWrapperProps> = ({
  children,
  isFeatured,
  className
}) => {
  if (!isFeatured) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div 
      className={cn(
        'relative',
        // Featured listing styling
        'bg-gradient-to-br from-yellow-50 to-orange-50',
        'border-2 border-yellow-200 rounded-lg',
        'shadow-lg shadow-yellow-100',
        'hover:shadow-xl hover:shadow-yellow-200 transition-all duration-300',
        // Ring effect
        'ring-2 ring-yellow-300 ring-opacity-50',
        className
      )}
    >
      <div className="absolute -top-1 -left-1 -right-1 -bottom-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-lg opacity-20 blur-sm"></div>
      <div className="relative bg-white rounded-lg overflow-hidden">
        <FeaturedListingBadge variant="medium" position="top-right" />
        {children}
      </div>
    </div>
  );
};

interface FeaturedListingHeaderProps {
  title: string;
  isFeatured: boolean;
  className?: string;
}

export const FeaturedListingHeader: React.FC<FeaturedListingHeaderProps> = ({
  title,
  isFeatured,
  className
}) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <h3 className={cn(
        'font-semibold',
        isFeatured && 'text-yellow-800'
      )}>
        {title}
      </h3>
      {isFeatured && (
        <FeaturedListingBadge variant="small" position="inline" showText={false} />
      )}
    </div>
  );
};

// Hook to check if a listing is currently featured
export const useFeaturedStatus = (listingId: string) => {
  const [isFeatured, setIsFeatured] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // In a real implementation, you would fetch this from your database
    // For now, we'll return false and let you implement the actual logic
    const checkFeaturedStatus = async () => {
      try {
        // TODO: Implement actual API call to check if listing is featured
        // const response = await supabase
        //   .from('active_featured_listings')
        //   .select('id')
        //   .eq('listing_id', listingId)
        //   .single();
        
        setIsFeatured(false); // Replace with actual logic
      } catch (error) {
        console.error('Error checking featured status:', error);
        setIsFeatured(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (listingId) {
      checkFeaturedStatus();
    } else {
      setIsLoading(false);
    }
  }, [listingId]);

  return { isFeatured, isLoading };
};

export default FeaturedListingBadge;
