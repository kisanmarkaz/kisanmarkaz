import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from "../_shared/cors.ts"

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    })
  }

  try {
    const payload = await req.json()
    console.log('Received Paddle webhook:', JSON.stringify(payload, null, 2))

    // Log the webhook event
    await supabase.from('webhook_logs').insert({
      event_type: payload.event_type,
      transaction_id: payload.data?.id || null,
      status: 'received',
      payload: payload
    })

    // Handle transaction.completed event
    if (payload.event_type === 'transaction.completed') {
      await handleTransactionCompleted(payload.data)
    } else if (payload.event_type === 'transaction.canceled' || payload.event_type === 'transaction.payment_failed') {
      await handleTransactionFailed(payload.data)
    } else {
      console.log('Unhandled event type:', payload.event_type)
      
      // Update webhook log
      await supabase.from('webhook_logs')
        .update({ 
          status: 'processed',
          processed_at: new Date().toISOString(),
          error_message: `Unhandled event type: ${payload.event_type}`
        })
        .eq('transaction_id', payload.data?.id)
        .order('created_at', { ascending: false })
        .limit(1)
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Webhook processing error:', error)

    // Try to log the error if we have a transaction ID
    try {
      const payload = await req.json()
      await supabase.from('webhook_logs')
        .update({ 
          status: 'error',
          processed_at: new Date().toISOString(),
          error_message: error.message
        })
        .eq('transaction_id', payload.data?.id)
        .order('created_at', { ascending: false })
        .limit(1)
    } catch (logError) {
      console.error('Failed to log webhook error:', logError)
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

async function handleTransactionCompleted(transactionData: any) {
  console.log('Processing completed transaction:', transactionData.id)

  const transactionId = transactionData.id
  const customData = transactionData.custom_data
  
  if (!customData || !customData.listingId || !customData.duration) {
    throw new Error('Missing required custom data in transaction')
  }

  const { listingId, userId, duration, paymentId } = customData

  // Update payment status
  const { error: paymentError } = await supabase
    .from('payments')
    .update({
      paddle_transaction_id: transactionId,
      status: 'completed'
    })
    .eq('id', paymentId)

  if (paymentError) {
    console.error('Failed to update payment status:', paymentError)
    throw new Error('Failed to update payment status')
  }

  // Calculate featured dates
  const startDate = new Date()
  const endDate = calculateFeaturedEndDate(duration, startDate)

  // Create featured listing record
  const { error: featuredError } = await supabase
    .from('featured_listings')
    .insert({
      listing_id: listingId,
      user_id: userId,
      featured_from: startDate.toISOString(),
      featured_until: endDate.toISOString(),
      duration_type: duration,
      price: getPriceForDuration(duration),
      status: 'active',
      paddle_transaction_id: transactionId,
      payment_id: paymentId
    })

  if (featuredError) {
    console.error('Failed to create featured listing:', featuredError)
    throw new Error('Failed to create featured listing record')
  }

  // Update listing to be featured
  const { error: listingError } = await supabase
    .from('listings')
    .update({
      featured: true,
      featured_expiry: endDate.toISOString()
    })
    .eq('id', listingId)

  if (listingError) {
    console.error('Failed to update listing featured status:', listingError)
    throw new Error('Failed to update listing featured status')
  }

  // Update webhook log
  await supabase.from('webhook_logs')
    .update({ 
      status: 'processed',
      processed_at: new Date().toISOString()
    })
    .eq('transaction_id', transactionId)
    .order('created_at', { ascending: false })
    .limit(1)

  console.log(`Successfully processed completed transaction ${transactionId} for listing ${listingId}`)
}

async function handleTransactionFailed(transactionData: any) {
  console.log('Processing failed transaction:', transactionData.id)

  const transactionId = transactionData.id
  const customData = transactionData.custom_data
  
  if (customData && customData.paymentId) {
    // Update payment status
    const { error: paymentError } = await supabase
      .from('payments')
      .update({
        paddle_transaction_id: transactionId,
        status: 'failed'
      })
      .eq('id', customData.paymentId)

    if (paymentError) {
      console.error('Failed to update payment status:', paymentError)
    }
  }

  // Update webhook log
  await supabase.from('webhook_logs')
    .update({ 
      status: 'processed',
      processed_at: new Date().toISOString()
    })
    .eq('transaction_id', transactionId)
    .order('created_at', { ascending: false })
    .limit(1)

  console.log(`Successfully processed failed transaction ${transactionId}`)
}

function calculateFeaturedEndDate(duration: string, startDate: Date = new Date()): Date {
  const endDate = new Date(startDate)
  
  switch (duration) {
    case 'day':
      endDate.setDate(endDate.getDate() + 1)
      break
    case 'week':
      endDate.setDate(endDate.getDate() + 7)
      break
    case 'month':
      endDate.setMonth(endDate.getMonth() + 1)
      break
    default:
      throw new Error(`Invalid duration: ${duration}`)
  }
  
  return endDate
}

function getPriceForDuration(duration: string): number {
  const prices = {
    day: 3,
    week: 15,
    month: 30
  }
  
  return prices[duration as keyof typeof prices] || 0
}