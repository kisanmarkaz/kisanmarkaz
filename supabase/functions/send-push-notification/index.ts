import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from 'https://esm.sh/web-push@3.6.7'

const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing environment variables')
}

// Initialize WebPush with your VAPID keys
webpush.setVapidDetails(
  'mailto:your-email@example.com', // Replace with your email
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
)

serve(async (req) => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Verify the request is authenticated
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Get request body
    const { message, userId } = await req.json()

    if (!message || !userId) {
      return new Response('Missing required fields', { status: 400 })
    }

    // Get user's push subscriptions
    const { data: subscriptions, error: dbError } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId)

    if (dbError) {
      console.error('Error fetching subscriptions:', dbError)
      return new Response('Error fetching subscriptions', { status: 500 })
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response('No subscriptions found', { status: 404 })
    }

    // Send push notification to all subscriptions
    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth
              }
            },
            message
          )
        } catch (error) {
          console.error('Error sending notification:', error)
          
          // If subscription is invalid, remove it
          if (error.statusCode === 410) {
            await supabase
              .from('push_subscriptions')
              .delete()
              .match({ endpoint: sub.endpoint })
          }
          
          throw error
        }
      })
    )

    const successful = results.filter((r) => r.status === 'fulfilled').length
    const failed = results.filter((r) => r.status === 'rejected').length

    return new Response(
      JSON.stringify({
        message: `Sent ${successful} notifications, ${failed} failed`,
        successful,
        failed
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}) 