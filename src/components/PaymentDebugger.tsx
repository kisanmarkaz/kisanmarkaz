import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { paddleService } from '@/services/paddleService';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const PaymentDebugger: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(message);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const testEdgeFunction = async () => {
    setIsLoading(true);
    addLog('🚀 Testing Edge Function directly...');
    
    try {
      const testPayload = {
        priceId: 'pri_01k3keg923y3tjdt9qssz5ych6', // Day price
        customerEmail: 'test@example.com',
        customData: {
          listingId: 'test-listing-123',
          userId: 'test-user-123',
          duration: 'day',
          paymentId: 'test-payment-123',
          listingTitle: 'Test Listing'
        },
        successUrl: `${window.location.origin}/payment/success?test=true`,
        cancelUrl: `${window.location.origin}/payment/cancelled?test=true`
      };

      addLog('📤 Sending request to Edge Function...');
      addLog(`📋 Payload: ${JSON.stringify(testPayload, null, 2)}`);

      const { data, error } = await supabase.functions.invoke('create-paddle-checkout', {
        body: testPayload,
      });

      if (error) {
        addLog(`❌ Edge Function Error: ${JSON.stringify(error, null, 2)}`);
      } else {
        addLog(`✅ Edge Function Success: ${JSON.stringify(data, null, 2)}`);
        if (data?.checkoutUrl) {
          addLog('🔗 Checkout URL received - payment flow should work!');
        }
      }
    } catch (err: any) {
      addLog(`💥 Exception: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testFullPaymentFlow = async () => {
    if (!user) {
      addLog('❌ Please log in first!');
      return;
    }

    setIsLoading(true);
    addLog('🔄 Testing full payment flow...');
    
    try {
      const result = await paddleService.createFeaturedListingCheckout({
        listingId: 'debug-listing-123',
        userId: user.id,
        duration: 'day',
        userEmail: user.email || 'test@example.com',
        listingTitle: 'Debug Test Listing',
      });

      addLog(`✅ Payment flow success: ${JSON.stringify(result, null, 2)}`);
      addLog('🔗 Ready to redirect to checkout!');
      
      // Ask user if they want to actually redirect
      if (window.confirm('Redirect to actual Paddle checkout?')) {
        paddleService.redirectToCheckout(result.checkoutUrl);
      }
    } catch (err: any) {
      addLog(`❌ Payment flow error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testPriceIds = () => {
    addLog('🏷️ Testing Price IDs...');
    const priceIds = {
      day: 'pri_01k3keg923y3tjdt9qssz5ych6',
      week: 'pri_01k3kegtft7zw2wpfdr6spaxzs',
      month: 'pri_01k3keh61xp92zf8brym62a09k'
    };
    
    Object.entries(priceIds).forEach(([duration, priceId]) => {
      addLog(`  ${duration}: ${priceId}`);
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>🔧 Payment System Debugger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={testPriceIds} disabled={isLoading}>
              Test Price IDs
            </Button>
            <Button onClick={testEdgeFunction} disabled={isLoading}>
              Test Edge Function
            </Button>
            <Button onClick={testFullPaymentFlow} disabled={isLoading}>
              Test Full Flow
            </Button>
            <Button onClick={clearLogs} variant="outline">
              Clear Logs
            </Button>
          </div>
          
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg max-h-96 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-gray-500">Click a button to start testing...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
          
          {user && (
            <div className="text-sm text-gray-600">
              Logged in as: {user.email}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentDebugger;