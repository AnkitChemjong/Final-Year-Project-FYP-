import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../ui/button';

const NotificationPermission = () => {
  useEffect(() => {
    // Only ask if notifications are supported
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    // Check if we've already asked
    const permissionAsked = localStorage.getItem('notificationPermissionAsked');
    
    if (!permissionAsked && Notification.permission === 'default') {
      toast.info(
        <div>
          <p>Enable notifications for course updates?</p>
          <div className="flex gap-2 mt-2">
            <Button 
              onClick={async () => {
                const permission = await Notification.requestPermission();
                localStorage.setItem('notificationPermissionAsked', 'true');
                if (permission === 'granted') {
                  toast.success('Notifications enabled!');
                }
              }}
              className="px-3 py-1 font-playfair bg-blue-600 text-white rounded text-sm"
            >
              Allow
            </Button>
            <Button 
              onClick={() => {
                localStorage.setItem('notificationPermissionAsked', 'true');
                toast.dismiss();
              }}
              className="px-3 py-1 font-playfair bg-gray-200 text-gray-800 rounded text-sm"
            >
              Later
            </Button>
          </div>
        </div>,
        {
          autoClose: false,
          closeOnClick: false,
          closeButton: false
        }
      );
    }
  }, []);

  return null;
};

export default NotificationPermission;