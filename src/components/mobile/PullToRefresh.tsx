import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export const PullToRefresh = ({ onRefresh, children }: PullToRefreshProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const pullThreshold = 100; // pixels to pull before refresh triggers
  
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, pullThreshold], [0, 1]);
  const scale = useTransform(y, [0, pullThreshold], [0.8, 1]);
  const controls = useAnimation();

  const handleTouchStart = (e: TouchEvent) => {
    if (window.scrollY === 0) { // Only enable at top of page
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (startY === 0 || isRefreshing) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    
    if (diff > 0 && window.scrollY === 0) {
      y.set(Math.min(diff * 0.5, pullThreshold * 1.5)); // Add resistance
      e.preventDefault();
    }
  };

  const handleTouchEnd = async () => {
    if (y.get() >= pullThreshold && !isRefreshing) {
      setIsRefreshing(true);
      
      // Animate to threshold
      await controls.start({
        y: pullThreshold,
        transition: { type: 'spring', stiffness: 400, damping: 30 }
      });
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setStartY(0);
        // Animate back to start
        await controls.start({
          y: 0,
          transition: { type: 'spring', stiffness: 400, damping: 30 }
        });
      }
    } else {
      // Animate back if not triggered
      controls.start({
        y: 0,
        transition: { type: 'spring', stiffness: 400, damping: 30 }
      });
    }
  };

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [startY, isRefreshing]);

  return (
    <div className="relative">
      <motion.div
        style={{ y }}
        animate={controls}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      >
        <motion.div
          style={{ opacity, scale }}
          className="bg-primary/10 rounded-full p-2 mt-2"
        >
          <Loader2 
            className={`w-6 h-6 text-primary ${isRefreshing ? 'animate-spin' : ''}`}
          />
        </motion.div>
      </motion.div>
      {children}
    </div>
  );
};
