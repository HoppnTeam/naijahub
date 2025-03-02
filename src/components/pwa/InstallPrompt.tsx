import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { logEvent } from '@/lib/monitoring';

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
      setShowPrompt(true);
      
      // Log the event
      logEvent('pwa', 'install_prompt_shown', {
        userAgent: navigator.userAgent,
        platform: navigator.platform
      });
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if the user has previously dismissed the prompt
    const hasUserDismissedPrompt = localStorage.getItem('pwa_prompt_dismissed');
    if (hasUserDismissedPrompt) {
      const dismissedTime = parseInt(hasUserDismissedPrompt, 10);
      const currentTime = new Date().getTime();
      
      // If it's been less than 7 days since dismissal, don't show the prompt
      if (currentTime - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        setShowPrompt(false);
      }
    }

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
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border shadow-lg z-50 flex justify-between items-center">
      <div className="flex-1">
        <h3 className="text-lg font-semibold">Install NaijaHub</h3>
        <p className="text-sm text-muted-foreground">Add NaijaHub to your home screen for a better experience</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleDismiss}>Not Now</Button>
        <Button onClick={handleInstallClick}>Install</Button>
      </div>
    </div>
  );
};

export default InstallPrompt;
