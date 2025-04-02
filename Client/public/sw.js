self.addEventListener('push', (event) => {
    const payload = event.data?.json() || {};
    
    event.waitUntil(
      self.registration.showNotification(
        payload.title || 'New Notification',
        {
          body: payload.body,
          data: payload.data,
          icon: '/icons/notification-icon.png',
          vibrate: [200, 100, 200]
        }
      )
    );
  });
  
  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || '/')
    );
  });