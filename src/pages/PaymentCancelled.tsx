import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';

const PaymentCancelled: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const listingId = searchParams.get('listing_id');

  const handleTryAgain = () => {
    if (listingId) {
      navigate(`/sell?retry_payment=${listingId}`);
    } else {
      navigate('/sell');
    }
  };

  const handleViewListing = () => {
    if (listingId) {
      navigate(`/listing/${listingId}`);
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <div className="text-center">
                <XCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                <CardTitle className="text-2xl text-orange-800">
                  Payment Cancelled
                </CardTitle>
                <CardDescription className="text-orange-700">
                  Your payment was cancelled and your listing was not featured
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-medium text-gray-900 mb-2">What happened?</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• The payment process was cancelled</li>
                  <li>• Your listing remains active but not featured</li>
                  <li>• No charges were made to your account</li>
                  <li>• You can try again at any time</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={handleTryAgain} 
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Featured Listing Again
                </Button>
                
                {listingId && (
                  <Button 
                    onClick={handleViewListing} 
                    variant="outline" 
                    className="w-full"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    View My Listing
                  </Button>
                )}
                
                <Button 
                  onClick={handleGoHome} 
                  variant="ghost" 
                  className="w-full"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </div>

              <div className="text-xs text-gray-500 text-center">
                Need help? Contact our support team for assistance with featured listings.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentCancelled;
