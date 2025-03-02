import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BetaBannerProps {
  className?: string;
}

export const BetaBanner = ({ className = '' }: BetaBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if the banner was previously dismissed
    const dismissed = localStorage.getItem('beta_banner_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Remember the dismissal for 24 hours
    localStorage.setItem('beta_banner_dismissed', 'true');
    setIsDismissed(true);
    
    // Reset after 24 hours
    setTimeout(() => {
      localStorage.removeItem('beta_banner_dismissed');
    }, 24 * 60 * 60 * 1000);
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className={`bg-primary/10 border-b border-primary/20 py-2 px-4 ${className}`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-primary" />
          <p className="text-sm font-medium">
            Welcome to the NaijaHub Beta! We're actively improving the platform.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="link" 
            size="sm" 
            className="text-primary"
            asChild
          >
            <Link to="/feedback">Submit Feedback</Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={handleDismiss}
          >
            <span className="sr-only">Dismiss</span>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
