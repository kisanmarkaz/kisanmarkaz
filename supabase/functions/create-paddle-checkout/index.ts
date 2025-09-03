// @ts-nocheck
// Edge Function - runs in Deno runtime (ignore TypeScript warnings)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

// Type definitions for Paddle checkout
type Duration = 'day' | 'week' | 'month';

interface CustomData {
  listingId: string;
  userId: string;
  duration: Duration;
  paymentId: string;
  listingTitle: string;
}

interface CheckoutRequest {
  priceId: string;
  customerEmail: string;
  customData: CustomData;
  successUrl: string;
  cancelUrl: string;
}

interface PaddleCheckoutPayload {
  items: Array<{
    price_id: string;
    quantity: number;
  }>;
  customer_email: string;
  custom_data: CustomData;
  return_url: string;
  discount_id: null;
}

interface PaddleCheckoutResponse {
  data: {
    id: string;
    url: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { priceId, customerEmail, customData, successUrl, cancelUrl }: CheckoutRequest = await req.json()

    // Validate required fields
    if (!priceId || !customerEmail || !customData || !successUrl || !cancelUrl) {
      throw new Error('Missing required fields: priceId, customerEmail, customData, successUrl, cancelUrl')
    }

    if (!customData.listingId || !customData.userId || !customData.duration || !customData.paymentId) {
      throw new Error('Missing required customData fields: listingId, userId, duration, paymentId')
    }

    console.log('Creating Paddle checkout with:', {
      priceId,
      customerEmail,
      successUrl,
      cancelUrl,
      customData
    })

    // Get Paddle API key from environment
    const paddleApiKey = Deno.env.get('PADDLE_API_KEY')
    if (!paddleApiKey) {
      throw new Error('PADDLE_API_KEY environment variable is not set')
    }

    // Create checkout session with Paddle API
    const checkoutPayload: PaddleCheckoutPayload = {
      items: [
        {
          price_id: priceId,
          quantity: 1
        }
      ],
      customer_email: customerEmail,
      custom_data: customData,
      return_url: successUrl,
      discount_id: null
    }

    console.log('Paddle checkout payload:', checkoutPayload)

    const response = await fetch('https://sandbox-api.paddle.com/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paddleApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(checkoutPayload)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Paddle API error:', response.status, errorText)
      throw new Error(`Paddle API error: ${response.status} - ${errorText}`)
    }

    const checkoutData: PaddleCheckoutResponse = await response.json()
    console.log('Paddle checkout response:', checkoutData)

    return new Response(
      JSON.stringify({
        success: true,
        checkoutUrl: checkoutData.data.url,
        checkoutId: checkoutData.data.id
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    )

  } catch (error: any) {
    console.error('Error creating checkout:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message || 'Unknown error occurred'
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    )
  }
})