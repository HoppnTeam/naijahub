import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download } from 'lucide-react';
import { 
  isAppInstalled, 
  isMobileDevice, 
  isIOS, 
  canPromptToInstall,
  recordInstallPrompt
} from '@/lib/pwa-utils';

interface InstallPromptProps {
  className?: string;
}

export const InstallPrompt = ({ className = '' }: InstallPromptProps) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  useEffect(() => {
    // Don't show if already installed or recently prompted
    if (isAppInstalled() || !canPromptToInstall()) {
      return;
    }

    setIsIOSDevice(isIOS());

    // For non-iOS devices, listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event so it can be triggered later
      setDeferredPrompt(e);
      // Show our custom install prompt
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS devices, just show our custom instructions
    if (isIOS() && isMobileDevice()) {
      setShowPrompt(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt && !isIOSDevice) return;

    if (isIOSDevice) {
      // Just record that we've shown the prompt
      recordInstallPrompt();
    } else {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const choiceResult = await deferredPrompt.userChoice;
      
      // Record that we've shown the prompt
      recordInstallPrompt();
      
      // Reset the deferred prompt variable
      setDeferredPrompt(null);
    }

    // Hide our custom prompt
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Still record that we've shown the prompt
    recordInstallPrompt();
  };

  if (!showPrompt) return null;

  return (
    <div className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-50 ${className}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">Install NaijaHub</h3>
        <Button variant="ghost" size="sm" onClick={handleDismiss} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        {isIOSDevice 
          ? 'Install NaijaHub on your iOS device: tap the share button and then "Add to Home Screen"'
          : 'Install NaijaHub for a better experience and offline access'
        }
      </p>
      
      {!isIOSDevice && (
        <Button 
          className="w-full" 
          onClick={handleInstallClick}
        >
          <Download className="mr-2 h-4 w-4" />
          Install App
        </Button>
      )}
      
      {isIOSDevice && (
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm">
          <ol className="list-decimal pl-4 space-y-2">
            <li>Tap the share button <span className="inline-block">⎙</span></li>
            <li>Scroll down and tap "Add to Home Screen"</li>
            <li>Tap "Add" in the upper right corner</li>
          </ol>
        </div>
      )}
    </div>
  );
};
