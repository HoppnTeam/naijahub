import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

export const OptimizedImage = ({ 
  src, 
  alt, 
  className, 
  sizes = '100vw', 
  priority = false,
  objectFit = 'cover'
}: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Reset states when src changes
    setLoaded(false);
    setError(false);
    
    if (!src) {
      setError(true);
      return;
    }

    const img = new Image();
    img.src = src;
    
    if (priority) {
      img.fetchPriority = 'high';
    }
    
    img.onload = () => setLoaded(true);
    img.onerror = () => setError(true);
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, priority]);

  if (error) {
    return (
      <div className={`bg-gray-200 rounded-md flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-md" />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        loading={priority ? 'eager' : 'lazy'}
        style={{ objectFit }}
        sizes={sizes}
      />
    </div>
  );
};
