import React, { useEffect, useState } from 'react';
import { AlertCircle, WifiOff } from 'lucide-react';
import { logEvent } from '@/lib/monitoring';

const OfflineIndicator: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false); // Initialize as online by default
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    // Check initial online status after a small delay to ensure app loads properly
    setTimeout(() => {
      setIsOffline(!navigator.onLine);
      setShowIndicator(!navigator.onLine); // Only show if offline
    }, 2000);

    const handleOnline = () => {
      setIsOffline(false);
      
      // Log the online event
      logEvent('connectivity', 'online', {
        timestamp: new Date().toISOString()
      });
      
      // Show the indicator briefly when coming back online
      setShowIndicator(true);
      setTimeout(() => setShowIndicator(false), 3000);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowIndicator(true);
      
      // Log the offline event
      logEvent('connectivity', 'offline', {
        timestamp: new Date().toISOString()
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Don't render anything if we're online and the indicator isn't showing
  if (!isOffline && !showIndicator) return null;

  return (
    <div 
      className={`fixed top-4 right-4 px-3 py-2 rounded-md z-40 flex items-center gap-2 transition-all duration-300 shadow-md text-sm ${
        isOffline 
          ? 'bg-destructive/90 text-destructive-foreground' 
          : 'bg-green-500/90 text-white'
      }`}
    >
      {isOffline ? (
        <>
          <WifiOff size={14} />
          <span>Offline</span>
        </>
      ) : (
        <>
          <AlertCircle size={14} />
          <span>Online</span>
        </>
      )}
    </div>
  );
};

export default OfflineIndicator;
