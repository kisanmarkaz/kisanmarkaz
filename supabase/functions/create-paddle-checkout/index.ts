import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { priceId, customerEmail, customData, successUrl, cancelUrl } = await req.json()

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
    const checkoutPayload = {
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

    const checkoutData = await response.json()
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

  } catch (error) {
    console.error('Error creating checkout:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
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