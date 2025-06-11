self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/notification-icon.png',
    badge: '/notification-badge.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Farmer OLX Harvest', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
}); 