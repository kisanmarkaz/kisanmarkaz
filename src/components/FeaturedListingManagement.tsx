import React, { useEffect, useState } from 'react';
import { Star, Clock, CheckCircle, XCircle, RefreshCw, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { paddleService } from '@/services/paddleService';
import { formatFeaturedDuration, isFeaturedActive } from '@/constants/featuredListing';
import { format } from 'date-fns';

interface FeaturedListing {
  id: string;
  listing_id: string;
  featured_from: string;
  featured_until: string;
  duration_type: 'day' | 'week' | 'month';
  price: number;
  status: 'pending' | 'active' | 'expired' | 'cancelled';
  paddle_transaction_id: string | null;
  listings?: {
    id: string;
    title: string;
    price: number;
    images: string[] | null;
  };
}

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  created_at: string;
  paddle_transaction_id: string | null;
  metadata: any;
}

const FeaturedListingManagement: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [featuredListings, setFeaturedListings] = useState<FeaturedListing[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [listings, payments] = await Promise.all([
        paddleService.getFeaturedListings(user!.id),
        paddleService.getPaymentHistory(user!.id)
      ]);
      
      setFeaturedListings(listings || []);
      setPaymentHistory(payments || []);
    } catch (error) {
      console.error('Failed to load featured listings:', error);
      toast({
        title: "Error",
        description: "Failed to load featured listings data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (listing: FeaturedListing) => {
    const now = new Date();
    const featuredFrom = new Date(listing.featured_from);
    const featuredUntil = new Date(listing.featured_until);
    const isActive = isFeaturedActive(featuredFrom, featuredUntil, now);

    switch (listing.status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          Pending Payment
        </Badge>;
      case 'active':
        return isActive ? 
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge> :
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            <XCircle className="h-3 w-3 mr-1" />
            Expired
          </Badge>;
      case 'expired':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">
          <XCircle className="h-3 w-3 mr-1" />
          Expired
        </Badge>;
      case 'cancelled':
        return <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Cancelled
        </Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">Cancelled</Badge>;
      case 'refunded':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Refunded</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  const formatDuration = (from: string, until: string) => {
    const fromDate = format(new Date(from), 'MMM dd');
    const untilDate = format(new Date(until), 'MMM dd, yyyy');
    return `${fromDate} - ${untilDate}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
          <p className="mt-2 text-gray-600">Loading featured listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Featured Listings</h2>
          <p className="text-gray-600">Manage your featured listings and payment history</p>
        </div>
        <Button onClick={loadData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Active/Recent Featured Listings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-500" />
            Your Featured Listings
          </CardTitle>
          <CardDescription>
            Current and recent featured listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {featuredListings.length === 0 ? (
            <div className="text-center py-8">
              <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No featured listings yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Create a listing and select the featured option to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {featuredListings.map((listing) => (
                <div
                  key={listing.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex space-x-4">
                      {listing.listings?.images?.[0] && (
                        <img
                          src={listing.listings.images[0]}
                          alt={listing.listings.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-lg">
                          {listing.listings?.title || 'Listing Title'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Duration: {formatFeaturedDuration(listing.duration_type)}
                        </p>
                        <p className="text-sm text-gray-600">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {formatDuration(listing.featured_from, listing.featured_until)}
                        </p>
                        <p className="text-sm font-medium text-green-600">
                          ${listing.price} USD
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(listing)}
                      {listing.paddle_transaction_id && (
                        <p className="text-xs text-gray-500 mt-1">
                          Transaction: {listing.paddle_transaction_id.substring(0, 8)}...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            All your featured listing payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paymentHistory.length === 0 ? (
            <div className="text-center py-8">
              <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-500">No payments yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentHistory.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      ${payment.amount} {payment.currency}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDateTime(payment.created_at)}
                    </p>
                    {payment.metadata?.listingTitle && (
                      <p className="text-sm text-gray-500">
                        {payment.metadata.listingTitle}
                      </p>
                    )}
                    {payment.paddle_transaction_id && (
                      <p className="text-xs text-gray-400">
                        ID: {payment.paddle_transaction_id}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    {getPaymentStatusBadge(payment.status)}
                    {payment.metadata?.duration && (
                      <p className="text-xs text-gray-500 mt-1">
                        {formatFeaturedDuration(payment.metadata.duration)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturedListingManagement;
