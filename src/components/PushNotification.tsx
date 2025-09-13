import { useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';

// Get VAPID key from environment
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY?.trim() || 'BHKTcDLAYUnM_aSql0hSIdPYmJtSC97zXaxbckL2WDLrijNVKsXCxwB55xXa-_xOqS5-912YrixXGyMo95j8ZtQ';

export function PushNotification() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const supabase = useSupabaseClient();
  const user = useUser();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((reg) => {
          setRegistration(reg);
          checkSubscription(reg);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  const checkSubscription = async (reg: ServiceWorkerRegistration) => {
    const subscription = await reg.pushManager.getSubscription();
    setIsSubscribed(!!subscription);
  };

  const subscribeToNotifications = async () => {
    try {
      if (!registration) return;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: VAPID_PUBLIC_KEY
      });

      const { endpoint, keys } = JSON.parse(JSON.stringify(subscription));
      
      await supabase.from('push_subscriptions').insert({
        user_id: user?.id,
        endpoint: endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth
      });

      setIsSubscribed(true);
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
    }
  };

  const unsubscribeFromNotifications = async () => {
    try {
      if (!registration) return;

      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        
        // Delete from database
        await supabase
          .from('push_subscriptions')
          .delete()
          .eq('endpoint', subscription.endpoint);
      }

      setIsSubscribed(false);
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
    }
  };

  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return null;
  }

  return (
    <div>
      {!isSubscribed ? (
        <Button onClick={subscribeToNotifications}>
          Enable Push Notifications
        </Button>
      ) : (
        <Button variant="outline" onClick={unsubscribeFromNotifications}>
          Disable Push Notifications
        </Button>
      )}
    </div>
  );
} 