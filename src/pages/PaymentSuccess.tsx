import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { paddleService } from '@/services/paddleService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listingId = searchParams.get('listing_id');
  const paymentId = searchParams.get('payment_id');
  const transactionId = searchParams.get('_ptxn') || searchParams.get('transaction_id');
  const checkoutId = searchParams.get('checkout_id');
  
  // Get custom data from URL if available
  const customDataParam = searchParams.get('_pcd');
  let customData: any = {};
  if (customDataParam) {
    try {
      customData = JSON.parse(decodeURIComponent(customDataParam));
    } catch (e) {
      console.error('Failed to parse custom data:', e);
    }
  }

  useEffect(() => {
    const processPaymentSuccess = async () => {
      try {
        if (!listingId) {
          throw new Error('Missing listing ID');
        }

        if (!transactionId && !checkoutId) {
          throw new Error('Missing payment information');
        }

        // Process the actual payment with Paddle service
        // The transactionId should be passed from Paddle webhook or success URL
        if (transactionId) {
          // In a real implementation, you would verify the transaction with Paddle API
          // For now, we'll process it through our service
          await paddleService.handlePaymentSuccess(transactionId, { listingId });
        }

        // Mark as complete
        setProcessingComplete(true);
        setIsProcessing(false);

        toast({
          title: "Payment Successful!",
          description: "Your listing has been featured successfully.",
        });
      } catch (err: any) {
        console.error('Payment processing error:', err);
        setError(err.message || 'Failed to process payment');
        setIsProcessing(false);
        
        toast({
          title: "Payment Processing Error",
          description: "There was an issue processing your payment. Please contact support.",
          variant: "destructive"
        });
      }
    };

    processPaymentSuccess();
  }, [listingId, transactionId, checkoutId, toast]);

  const handleViewListing = () => {
    if (listingId) {
      navigate(`/listing/${listingId}`);
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewDashboard = () => {
    navigate('/dashboard');
  };

  if (isProcessing) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                  <h2 className="text-xl font-semibold">Processing Payment...</h2>
                  <p className="text-gray-600">
                    Please wait while we confirm your payment and activate your featured listing.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600 text-center">
                  Payment Processing Error
                </CardTitle>
                <CardDescription className="text-center">
                  {error}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <Button onClick={handleGoHome}>
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <CardTitle className="text-2xl text-green-800">
                  Payment Successful!
                </CardTitle>
                <CardDescription className="text-green-700">
                  Your listing has been featured successfully
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-medium text-gray-900 mb-2">What happens next?</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Your listing is now featured and will appear at the top of search results</li>
                  <li>• Featured status will be visible with special badges</li>
                  <li>• You'll receive increased visibility and engagement</li>
                  <li>• Featured period starts immediately</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={handleViewListing} 
                  className="w-full"
                  disabled={!listingId}
                >
                  View My Featured Listing
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                
                <Button 
                  onClick={handleViewDashboard} 
                  variant="outline" 
                  className="w-full"
                >
                  Go to Dashboard
                </Button>
                
                <Button 
                  onClick={handleGoHome} 
                  variant="ghost" 
                  className="w-full"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentSuccess;
