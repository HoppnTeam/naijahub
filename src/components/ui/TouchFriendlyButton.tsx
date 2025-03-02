import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { isMobileDevice } from '@/lib/pwa-utils';

interface TouchFriendlyButtonProps extends ButtonProps {
  touchClassName?: string;
  children: React.ReactNode;
}

/**
 * A button component optimized for touch interactions on mobile devices.
 * It automatically applies larger touch targets and appropriate spacing on mobile.
 */
export const TouchFriendlyButton = ({
  className = '',
  touchClassName = '',
  children,
  ...props
}: TouchFriendlyButtonProps) => {
  const isMobile = isMobileDevice();
  
  // Apply mobile-specific classes if on a mobile device
  const mobileClasses = isMobile 
    ? `min-h-[44px] px-4 ${touchClassName}` // 44px is Apple's recommended minimum touch target size
    : '';
  
  return (
    <Button
      className={`${className} ${mobileClasses}`}
      {...props}
    >
      {children}
    </Button>
  );
};
