import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { setupConnectivityListeners, isOnline } from '@/lib/pwa-utils';

export const OfflineIndicator = () => {
  const [isOffline, setIsOffline] = useState(!isOnline());

  useEffect(() => {
    const cleanup = setupConnectivityListeners(
      // Offline handler
      () => {
        setIsOffline(true);
      },
      // Online handler
      () => {
        setIsOffline(false);
      }
    );

    return cleanup;
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 bg-yellow-500 text-white py-2 px-4 text-center text-sm z-50 flex items-center justify-center">
      <WifiOff className="h-4 w-4 mr-2" />
      <span>You're offline. Some features may be limited.</span>
    </div>
  );
};
