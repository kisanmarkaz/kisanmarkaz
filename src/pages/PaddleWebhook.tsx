import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { paddleService } from '@/services/paddleService';

const PaddleWebhook: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const processWebhook = async () => {
      try {
        // Get webhook data from URL parameters or body
        const eventType = searchParams.get('event_type');
        const transactionId = searchParams.get('transaction_id');
        const customData = {
          listingId: searchParams.get('listing_id'),
          userId: searchParams.get('user_id'),
          duration: searchParams.get('duration')
        };

        if (eventType === 'transaction.completed' && transactionId) {
          await paddleService.handlePaymentSuccess(transactionId, customData);
          setStatus('success');
          setMessage('Payment processed successfully and listing has been featured!');
        } else if (eventType === 'transaction.canceled' && transactionId) {
          await paddleService.handlePaymentFailure(transactionId);
          setStatus('error');
          setMessage('Payment was canceled.');
        } else {
          setStatus('error');
          setMessage('Invalid webhook data received.');
        }
      } catch (error: any) {
        console.error('Webhook processing failed:', error);
        setStatus('error');
        setMessage(`Error processing payment: ${error.message}`);
      }
    };

    processWebhook();
  }, [searchParams]);

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Clock className="h-12 w-12 text-yellow-500 animate-pulse" />;
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case 'error':
        return <XCircle className="h-12 w-12 text-red-500" />;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'processing':
        return 'Processing Payment...';
      case 'success':
        return 'Payment Successful!';
      case 'error':
        return 'Payment Error';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className={`${status === 'success' ? 'border-green-200 bg-green-50' : 
                           status === 'error' ? 'border-red-200 bg-red-50' : 
                           'border-yellow-200 bg-yellow-50'}`}>
            <CardHeader>
              <div className="text-center">
                {getStatusIcon()}
                <CardTitle className={`text-2xl mt-4 ${
                  status === 'success' ? 'text-green-800' : 
                  status === 'error' ? 'text-red-800' : 
                  'text-yellow-800'
                }`}>
                  {getStatusTitle()}
                </CardTitle>
                <CardDescription className={
                  status === 'success' ? 'text-green-700' : 
                  status === 'error' ? 'text-red-700' : 
                  'text-yellow-700'
                }>
                  {message}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {status === 'success' && (
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    Your listing is now featured and will appear at the top of search results.
                  </p>
                  <p className="text-sm text-gray-600">
                    You can close this window safely.
                  </p>
                </div>
              )}
              {status === 'error' && (
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    If you need assistance, please contact support with the error details.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PaddleWebhook;
