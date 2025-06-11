import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface PushSubscriptionData {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export const usePushNotification = () => {
  const [subscription, setSubscription] = useState<PushSubscriptionData | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  };

  const subscribeToNotifications = async () => {
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        throw new Error('Push notifications are not supported');
      }

      const registration = await registerServiceWorker();
      
      // Request notification permission
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }

      // Get the push subscription
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        const subscriptionData = existingSubscription.toJSON() as PushSubscriptionData;
        setSubscription(subscriptionData);
        return existingSubscription;
      }

      // Generate VAPID key pair on your server and store it securely
      const response = await fetch('/api/vapid-public-key');
      const vapidPublicKey = await response.text();
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey
      });

      const subscriptionData = subscription.toJSON() as PushSubscriptionData;

      const { data: { user } } = await supabase.auth.getUser();

      // Save the subscription to your database
      await supabase
        .from('push_subscriptions')
        .upsert([
          {
            endpoint: subscriptionData.endpoint,
            p256dh: subscriptionData.keys.p256dh,
            auth: subscriptionData.keys.auth,
            user_id: user?.id
          }
        ]);

      setSubscription(subscriptionData);
      return subscription;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      throw error;
    }
  };

  const unsubscribeFromNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        
        // Remove subscription from database
        await supabase
          .from('push_subscriptions')
          .delete()
          .match({ endpoint: subscription.endpoint });
          
        setSubscription(null);
      }
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      throw error;
    }
  };

  return {
    subscription,
    permission,
    subscribeToNotifications,
    unsubscribeFromNotifications
  };
}; 