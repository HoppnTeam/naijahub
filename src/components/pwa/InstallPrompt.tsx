import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { logEvent } from '@/lib/monitoring';
import { X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [installationStatus, setInstallationStatus] = useState<'pending' | 'accepted' | 'dismissed' | null>(null);

  useEffect(() => {
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      // App is already installed, no need to show the prompt
      return;
    }

    // Store the event for later use
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Delay showing the prompt by 10 seconds to allow the app to load properly
      setTimeout(() => {
        // Check if the user has previously dismissed the prompt
        const hasUserDismissedPrompt = localStorage.getItem('pwa_prompt_dismissed');
        if (hasUserDismissedPrompt) {
          const dismissedTime = parseInt(hasUserDismissedPrompt, 10);
          const currentTime = new Date().getTime();
          
          // If it's been less than 7 days since dismissal, don't show the prompt
          if (currentTime - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
            return;
          }
        }
        
        setShowPrompt(true);
        
        // Log the event
        logEvent('pwa', 'install_prompt_shown', {
          userAgent: navigator.userAgent,
          platform: navigator.platform
        });
      }, 10000); // 10 second delay
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for the appinstalled event
    const handleAppInstalled = () => {
      setShowPrompt(false);
      setInstallationStatus('accepted');
      
      // Log the installation
      logEvent('pwa', 'app_installed', {
        userAgent: navigator.userAgent,
        platform: navigator.platform
      });
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice;
    
    // Update state based on user choice
    setInstallationStatus(choiceResult.outcome);
    
    // Log the user's choice
    logEvent('pwa', `install_${choiceResult.outcome}`, {
      userAgent: navigator.userAgent,
      platform: navigator.platform
    });

    // If dismissed, store the time to prevent showing again too soon
    if (choiceResult.outcome === 'dismissed') {
      localStorage.setItem('pwa_prompt_dismissed', new Date().getTime().toString());
    }

    // Clear the deferredPrompt variable
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_prompt_dismissed', new Date().getTime().toString());
    
    // Log the dismissal
    logEvent('pwa', 'install_prompt_dismissed_manually', {
      userAgent: navigator.userAgent,
      platform: navigator.platform
    });
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-background border border-border rounded-lg shadow-lg z-40 max-w-xs">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-base font-semibold">Install NaijaHub</h3>
        <Button variant="ghost" size="icon" onClick={handleDismiss} className="h-6 w-6">
          <X size={16} />
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mb-3">Add NaijaHub to your home screen for a better experience</p>
      <div className="flex justify-end">
        <Button size="sm" onClick={handleInstallClick}>Install</Button>
      </div>
    </div>
  );
};

export default InstallPrompt;
