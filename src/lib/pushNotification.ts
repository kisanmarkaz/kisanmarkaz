import { supabase } from './supabase';

export async function sendPushNotification(userId: string, message: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Not authenticated');
    }

    const response = await fetch('/functions/v1/send-push-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        userId,
        message
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to send push notification: ${error}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
} 