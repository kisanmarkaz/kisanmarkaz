import React, { useState } from 'react';
import { Star, Crown, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { getFeaturedPricingOptions, type FeaturedDuration } from '@/constants/featuredListing';

interface FeaturedListingSelectorProps {
  onSelectionChange: (selected: FeaturedDuration | null) => void;
  selectedDuration: FeaturedDuration | null;
  disabled?: boolean;
}

const FeaturedListingSelector: React.FC<FeaturedListingSelectorProps> = ({
  onSelectionChange,
  selectedDuration,
  disabled = false
}) => {
  const [wantsFeatured, setWantsFeatured] = useState<boolean>(!!selectedDuration);
  const pricingOptions = getFeaturedPricingOptions();

  const handleFeaturedToggle = (checked: boolean) => {
    setWantsFeatured(checked);
    if (!checked) {
      onSelectionChange(null);
    }
  };

  const handleDurationSelect = (duration: FeaturedDuration) => {
    onSelectionChange(duration);
  };

  const getDurationIcon = (duration: FeaturedDuration) => {
    switch (duration) {
      case 'day':
        return <Zap className="h-5 w-5" />;
      case 'week':
        return <Star className="h-5 w-5" />;
      case 'month':
        return <Crown className="h-5 w-5" />;
      default:
        return <Star className="h-5 w-5" />;
    }
  };

  const getPopularBadge = (duration: FeaturedDuration) => {
    return duration === 'week' ? (
      <Badge variant="secondary" className="ml-2">
        Popular
      </Badge>
    ) : null;
  };

  const getBestValueBadge = (duration: FeaturedDuration) => {
    return duration === 'month' ? (
      <Badge variant="default" className="ml-2">
        Best Value
      </Badge>
    ) : null;
  };

  return (
    <div className="space-y-4">
      <Card className="border-2 border-dashed border-orange-200 bg-orange-50">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-lg text-orange-800">
              Make Your Listing Stand Out
            </CardTitle>
          </div>
          <CardDescription className="text-orange-700">
            Featured listings get more visibility and appear at the top of search results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="want-featured"
              checked={wantsFeatured}
              onCheckedChange={handleFeaturedToggle}
              disabled={disabled}
            />
            <label
              htmlFor="want-featured"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-orange-800"
            >
              I want to feature this listing
            </label>
          </div>
        </CardContent>
      </Card>

      {wantsFeatured && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Choose Featured Duration</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pricingOptions.map((option) => {
              const isSelected = selectedDuration === option.key;
              return (
                <Card
                  key={option.key}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected
                      ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                      : 'hover:border-green-300'
                  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => !disabled && handleDurationSelect(option.key)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getDurationIcon(option.key)}
                        <CardTitle className="text-lg">{option.label}</CardTitle>
                      </div>
                      <div className="flex items-center">
                        {getPopularBadge(option.key)}
                        {getBestValueBadge(option.key)}
                      </div>
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold text-green-600">
                        ${option.price}
                      </span>
                      <span className="text-sm text-gray-500">USD</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {option.description}
                    </CardDescription>
                    <div className="mt-3 text-xs text-gray-500">
                      ${(option.price / option.duration).toFixed(2)} per day
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {selectedDuration && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-900">
                      Selected: {pricingOptions.find(p => p.key === selectedDuration)?.label}
                    </p>
                    <p className="text-sm text-blue-700">
                      Your listing will be featured for{' '}
                      {pricingOptions.find(p => p.key === selectedDuration)?.duration} days
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-900">
                      ${pricingOptions.find(p => p.key === selectedDuration)?.price} USD
                    </p>
                    <p className="text-xs text-blue-600">
                      Payment processed by Paddle
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-xs text-gray-500 space-y-1">
            <p>• Featured listings appear at the top of search results</p>
            <p>• Get highlighted with special badges and styling</p>
            <p>• Increase visibility and engagement</p>
            <p>• Secure payment processing through Paddle</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedListingSelector;
