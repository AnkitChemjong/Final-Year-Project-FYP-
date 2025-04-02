export const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        return await navigator.serviceWorker.register('/sw.js');
      } catch (error) {
        console.error('ServiceWorker registration failed:', error);
      }
    }
  };
  
  export const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      return await Notification.requestPermission();
    }
    return 'denied';
  };
  
  export const subscribeToPush = async (socket, userId) => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.VITE_SERVICE_WORKER_PUBLIC_KEY)
      });
  
      // Send subscription to backend via socket
      socket.emit('register-push', subscription);
      return true;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return false;
    }
  };
  
  // Helper function to convert VAPID key
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }