import React, { useEffect, useState } from 'react';
import { AlertCircle, WifiOff } from 'lucide-react';
import { logEvent } from '@/lib/monitoring';

const OfflineIndicator: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
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

    // Initialize the indicator visibility
    setShowIndicator(isOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Don't render anything if we're online and the indicator isn't showing
  if (!isOffline && !showIndicator) return null;

  return (
    <div 
      className={`fixed bottom-16 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full z-50 flex items-center gap-2 transition-all duration-300 ${
        isOffline 
          ? 'bg-destructive text-destructive-foreground' 
          : 'bg-green-500 text-white'
      }`}
    >
      {isOffline ? (
        <>
          <WifiOff size={16} />
          <span>You are offline. Some features may be limited.</span>
        </>
      ) : (
        <>
          <AlertCircle size={16} />
          <span>You are back online!</span>
        </>
      )}
    </div>
  );
};

export default OfflineIndicator;
