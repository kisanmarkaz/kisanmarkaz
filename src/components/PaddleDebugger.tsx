import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { PADDLE_CONFIG } from '@/constants/featuredListing';
import { paddleService } from '@/services/paddleService';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

const PaddleDebugger: React.FC = () => {
  const [testResults, setTestResults] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const checkConfiguration = () => {
    const results: any = {
      environment: PADDLE_CONFIG.environment,
      hasVendorId: !!PADDLE_CONFIG.vendorId,
      hasClientToken: !!PADDLE_CONFIG.clientSideToken,
      hasApiKey: !!PADDLE_CONFIG.apiKey,
      vendorIdValue: PADDLE_CONFIG.vendorId,
      clientTokenLength: PADDLE_CONFIG.clientSideToken?.length || 0,
      apiKeyPrefix: PADDLE_CONFIG.apiKey?.substring(0, 20) + '...',
      priceIds: {
        day: import.meta.env.VITE_PADDLE_PRICE_ID_DAY || 'Not set',
        week: import.meta.env.VITE_PADDLE_PRICE_ID_WEEK || 'Not set',
        month: import.meta.env.VITE_PADDLE_PRICE_ID_MONTH || 'Not set',
      }
    };
    
    setTestResults(results);
  };

  const testPaddleInitialization = async () => {
    setIsLoading(true);
    try {
      await paddleService.initialize();
      setTestResults(prev => ({ ...prev, initializationSuccess: true, initializationError: null }));
    } catch (error: any) {
      console.error('Paddle initialization failed:', error);
      setTestResults(prev => ({ 
        ...prev, 
        initializationSuccess: false, 
        initializationError: error.message 
      }));
    }
    setIsLoading(false);
  };

  const testCheckout = async () => {
    setIsLoading(true);
    try {
      // Mock data for testing
      const mockPaymentData = {
        listingId: 'test-listing-123',
        userId: 'test-user-123',
        duration: 'day' as const,
        userEmail: 'test@example.com',
        listingTitle: 'Test Listing'
      };

      const checkoutId = await paddleService.createFeaturedListingCheckout(mockPaymentData);
      setTestResults(prev => ({ 
        ...prev, 
        checkoutSuccess: true, 
        checkoutId,
        checkoutError: null 
      }));
    } catch (error: any) {
      console.error('Checkout test failed:', error);
      setTestResults(prev => ({ 
        ...prev, 
        checkoutSuccess: false, 
        checkoutError: error.message 
      }));
    }
    setIsLoading(false);
  };

  const getStatusIcon = (success: boolean | undefined) => {
    if (success === undefined) return <Info className="h-4 w-4" />;
    return success ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <XCircle className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Paddle Configuration Debugger
          </CardTitle>
          <CardDescription>
            Use this tool to diagnose and fix Paddle payment gateway issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Configuration Check */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Configuration Status</h3>
              <Button onClick={checkConfiguration} variant="outline" size="sm">
                Check Config
              </Button>
            </div>
            
            {Object.keys(testResults).length > 0 && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <span>Environment:</span>
                    <Badge variant="secondary">{testResults.environment}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Vendor ID:</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(testResults.hasVendorId)}
                      <span className="text-sm">{testResults.vendorIdValue || 'Not set'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Client Token:</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(testResults.hasClientToken)}
                      <span className="text-sm">{testResults.clientTokenLength} chars</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>API Key:</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(testResults.hasApiKey)}
                      <span className="text-sm">{testResults.apiKeyPrefix}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Price IDs:</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Day:</span>
                      <span className={testResults.priceIds.day === 'Not set' ? 'text-red-500' : 'text-green-600'}>
                        {testResults.priceIds.day}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Week:</span>
                      <span className={testResults.priceIds.week === 'Not set' ? 'text-red-500' : 'text-green-600'}>
                        {testResults.priceIds.week}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Month:</span>
                      <span className={testResults.priceIds.month === 'Not set' ? 'text-red-500' : 'text-green-600'}>
                        {testResults.priceIds.month}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Paddle Initialization Test */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Paddle Initialization</h3>
              <Button 
                onClick={testPaddleInitialization} 
                variant="outline" 
                size="sm"
                disabled={isLoading}
              >
                Test Initialize
              </Button>
            </div>
            
            {testResults.initializationSuccess !== undefined && (
              <Alert className={testResults.initializationSuccess ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.initializationSuccess)}
                  <AlertDescription>
                    {testResults.initializationSuccess 
                      ? 'Paddle initialized successfully!'
                      : `Initialization failed: ${testResults.initializationError}`
                    }
                  </AlertDescription>
                </div>
              </Alert>
            )}
          </div>

          {/* Checkout Test */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Checkout Test</h3>
              <Button 
                onClick={testCheckout} 
                variant="outline" 
                size="sm"
                disabled={isLoading}
              >
                Test Checkout
              </Button>
            </div>
            
            {testResults.checkoutSuccess !== undefined && (
              <Alert className={testResults.checkoutSuccess ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.checkoutSuccess)}
                  <AlertDescription>
                    {testResults.checkoutSuccess 
                      ? `Checkout created successfully! ID: ${testResults.checkoutId}`
                      : `Checkout failed: ${testResults.checkoutError}`
                    }
                  </AlertDescription>
                </div>
              </Alert>
            )}
          </div>

          {/* Common Issues */}
          <div>
            <h3 className="text-lg font-medium mb-4">Common Issues & Solutions</h3>
            <div className="space-y-3 text-sm">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>ERR_BLOCKED_BY_CLIENT:</strong> Disable ad blockers (uBlock Origin, AdBlock) for your localhost or domain.
                </AlertDescription>
              </Alert>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>400 Error:</strong> Check that your Price IDs are valid and exist in your Paddle dashboard.
                </AlertDescription>
              </Alert>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Token Issues:</strong> Make sure you're using the client-side token, not the API key, for frontend initialization.
                </AlertDescription>
              </Alert>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Environment:</strong> Verify you're using 'sandbox' environment with sandbox tokens for testing.
                </AlertDescription>
              </Alert>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default PaddleDebugger;
