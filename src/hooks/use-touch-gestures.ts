import { useEffect, useState } from 'react';

interface TouchGestureConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}

export const useTouchGestures = (ref: React.RefObject<HTMLElement>, config: TouchGestureConfig) => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const threshold = config.threshold || 50;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      });
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart) return;

      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      };

      const deltaX = touchStart.x - touchEnd.x;
      const deltaY = touchStart.y - touchEnd.y;

      // Check if horizontal or vertical swipe based on which delta is larger
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > threshold) {
          if (deltaX > 0 && config.onSwipeLeft) {
            config.onSwipeLeft();
          } else if (deltaX < 0 && config.onSwipeRight) {
            config.onSwipeRight();
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > threshold) {
          if (deltaY > 0 && config.onSwipeUp) {
            config.onSwipeUp();
          } else if (deltaY < 0 && config.onSwipeDown) {
            config.onSwipeDown();
          }
        }
      }

      setTouchStart(null);
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [ref, touchStart, config, threshold]);
};
