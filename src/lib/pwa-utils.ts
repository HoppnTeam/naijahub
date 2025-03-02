/**
 * Progressive Web App (PWA) utility functions for NaijaHub
 */

// Service Worker Registration
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });
      
      console.log('Service Worker registered successfully:', registration.scope);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  
  console.warn('Service Workers are not supported in this browser');
  return null;
};

// Check if the app is already installed
export const isAppInstalled = (): boolean => {
  // Check if in standalone mode (PWA installed)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }
  
  // For iOS devices using "Add to Home Screen"
  if (
    navigator.standalone || 
    window.navigator.standalone === true
  ) {
    return true;
  }
  
  return false;
};

// Check if the device is mobile
export const isMobileDevice = (): boolean => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // Check for mobile devices
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  
  return mobileRegex.test(userAgent);
};

// Check if the device is running iOS
export const isIOS = (): boolean => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // Check for iOS devices
  return /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
};

// Show iOS-specific install instructions
export const showIOSInstallInstructions = (): void => {
  if (!isIOS()) return;
  
  // Implementation would depend on your UI framework
  console.log('Show iOS install instructions');
  // You would typically show a modal or tooltip here
};

// Set up listeners for online/offline events
export const setupConnectivityListeners = (
  offlineCallback: () => void,
  onlineCallback: () => void
): () => void => {
  const handleOffline = () => {
    offlineCallback();
  };
  
  const handleOnline = () => {
    onlineCallback();
  };
  
  window.addEventListener('offline', handleOffline);
  window.addEventListener('online', handleOnline);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('offline', handleOffline);
    window.removeEventListener('online', handleOnline);
  };
};

// Check if the device is currently online
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Cache data for offline use
export const cacheData = async (key: string, data: any): Promise<void> => {
  try {
    localStorage.setItem(`naijahub_cache_${key}`, JSON.stringify({
      timestamp: Date.now(),
      data
    }));
  } catch (error) {
    console.error('Failed to cache data:', error);
  }
};

// Retrieve cached data
export const getCachedData = <T>(key: string, maxAgeMs = 3600000): T | null => {
  try {
    const cachedItem = localStorage.getItem(`naijahub_cache_${key}`);
    
    if (!cachedItem) return null;
    
    const { timestamp, data } = JSON.parse(cachedItem);
    
    // Check if cache is still valid
    if (Date.now() - timestamp > maxAgeMs) {
      localStorage.removeItem(`naijahub_cache_${key}`);
      return null;
    }
    
    return data as T;
  } catch (error) {
    console.error('Failed to retrieve cached data:', error);
    return null;
  }
};

// Check if we can prompt to install
export const canPromptToInstall = (): boolean => {
  // Check if we've already prompted recently
  const lastPrompt = localStorage.getItem('naijahub_install_prompt');
  
  if (lastPrompt) {
    const lastPromptDate = new Date(parseInt(lastPrompt, 10));
    const now = new Date();
    
    // Don't prompt again for 7 days
    const daysSinceLastPrompt = Math.floor((now.getTime() - lastPromptDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastPrompt < 7) {
      return false;
    }
  }
  
  return !isAppInstalled();
};

// Record that we've shown the install prompt
export const recordInstallPrompt = (): void => {
  localStorage.setItem('naijahub_install_prompt', Date.now().toString());
};

// Handle app updates
export const checkForAppUpdates = async (): Promise<boolean> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Check for updates
      await registration.update();
      
      return true;
    } catch (error) {
      console.error('Failed to check for updates:', error);
      return false;
    }
  }
  
  return false;
};

// Show update notification
export const showUpdateNotification = (
  onAccept: () => void,
  onDismiss: () => void
): void => {
  // Implementation would depend on your UI framework
  console.log('Show update notification');
  // You would typically show a modal or toast here
};

// Reload the app to apply updates
export const reloadToApplyUpdates = (): void => {
  window.location.reload();
};

// Get device orientation
export const getDeviceOrientation = (): 'portrait' | 'landscape' => {
  return window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape';
};

// Set up orientation change listener
export const setupOrientationChangeListener = (
  callback: (orientation: 'portrait' | 'landscape') => void
): () => void => {
  const handleOrientationChange = () => {
    callback(getDeviceOrientation());
  };
  
  window.addEventListener('orientationchange', handleOrientationChange);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('orientationchange', handleOrientationChange);
  };
};

// Detect if running in a PWA context
export const isPWA = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true;
};

// Get screen size category
export const getScreenSizeCategory = (): 'xs' | 'sm' | 'md' | 'lg' | 'xl' => {
  const width = window.innerWidth;
  
  if (width < 640) return 'xs';
  if (width < 768) return 'sm';
  if (width < 1024) return 'md';
  if (width < 1280) return 'lg';
  return 'xl';
};

// Detect high-end device
export const isHighEndDevice = async (): Promise<boolean> => {
  // Check for device memory API
  if ('deviceMemory' in navigator) {
    return (navigator as any).deviceMemory >= 4; // 4GB or more RAM
  }
  
  // Fallback: check for hardware concurrency
  if ('hardwareConcurrency' in navigator) {
    return navigator.hardwareConcurrency >= 4; // 4 or more cores
  }
  
  return true; // Default to true if we can't detect
};
