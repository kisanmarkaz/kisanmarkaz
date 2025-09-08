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

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
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

      // Read public VAPID key from environment (must be URL-safe base64)
      const vapidPublicKey = (import.meta as any)?.env?.VITE_VAPID_PUBLIC_KEY as string | undefined;
      if (!vapidPublicKey) {
        throw new Error('Missing VAPID public key. Set VITE_VAPID_PUBLIC_KEY in your environment.');
      }
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
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