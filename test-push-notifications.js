// Test script for push notifications
// Run this in your browser console to test the push notification system

async function testPushNotifications() {
  console.log('🧪 Testing Push Notification System...');
  
  // Check browser support
  if (!('serviceWorker' in navigator)) {
    console.error('❌ Service Worker not supported');
    return;
  }
  
  if (!('PushManager' in window)) {
    console.error('❌ Push Manager not supported');
    return;
  }
  
  if (!('Notification' in window)) {
    console.error('❌ Notification API not supported');
    return;
  }
  
  console.log('✅ Browser supports push notifications');
  
  // Check notification permission
  const permission = Notification.permission;
  console.log(`📱 Notification permission: ${permission}`);
  
  if (permission === 'denied') {
    console.error('❌ Notifications are blocked. Please enable them in browser settings.');
    return;
  }
  
  // Test service worker registration
  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    console.log('✅ Service Worker registered successfully');
    
    // Test push subscription
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      console.log('✅ Push subscription exists');
      console.log('Subscription details:', subscription.toJSON());
    } else {
      console.log('⚠️ No push subscription found. You need to subscribe first.');
    }
    
  } catch (error) {
    console.error('❌ Service Worker registration failed:', error);
  }
}

// Run the test
testPushNotifications();
