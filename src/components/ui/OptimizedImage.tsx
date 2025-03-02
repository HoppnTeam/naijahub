import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  aspectRatio?: '1:1' | '16:9' | '4:3' | '3:2' | 'auto';
}

/**
 * A component for optimized image loading with lazy loading, error handling,
 * and responsive sizing support.
 */
export const OptimizedImage = ({ 
  src, 
  alt, 
  className = '',
  sizes = '100vw',
  priority = false,
  objectFit = 'cover',
  aspectRatio = 'auto'
}: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setError(false);
    
    if (priority) {
      // If priority is true, preload the image
      const img = new Image();
      img.src = src;
      img.onload = () => setLoaded(true);
      img.onerror = () => setError(true);
    }
  }, [src, priority]);

  const aspectRatioClass = {
    '1:1': 'aspect-square',
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '3:2': 'aspect-[3/2]',
    'auto': ''
  }[aspectRatio];

  const objectFitClass = {
    'contain': 'object-contain',
    'cover': 'object-cover',
    'fill': 'object-fill',
    'none': 'object-none',
    'scale-down': 'object-scale-down'
  }[objectFit];

  if (error) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center text-gray-400 ${aspectRatioClass} ${className}`}>
        <span className="text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${aspectRatioClass} ${className}`}>
      {!loaded && !priority && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-md" />
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full ${objectFitClass} ${loaded || priority ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        sizes={sizes}
      />
    </div>
  );
};
