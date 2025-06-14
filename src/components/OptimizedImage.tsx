import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  priority = false,
  placeholder,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading === 'eager') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before the image enters viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, loading]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate srcset for responsive images
  const generateSrcSet = (baseSrc: string) => {
    if (!baseSrc.includes('http')) return undefined;
    
    // For external images, we can't generate srcset
    // In a real app, you'd use a service like Cloudinary or similar
    return undefined;
  };

  const imageProps = {
    ref: imgRef,
    alt,
    width,
    height,
    loading: priority ? 'eager' as const : loading,
    onLoad: handleLoad,
    onError: handleError,
    className: `${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`,
    style: {
      aspectRatio: width && height ? `${width}/${height}` : undefined,
    },
  };

  if (hasError) {
    return (
      <div 
        className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Placeholder */}
      {!isLoaded && placeholder && (
        <div 
          className={`absolute inset-0 ${className} bg-gray-200 dark:bg-gray-700 animate-pulse`}
          style={{ width, height }}
        />
      )}
      
      {/* Actual image */}
      {isInView && (
        <img
          {...imageProps}
          src={src}
          srcSet={generateSrcSet(src)}
          sizes={width ? `(max-width: 768px) 100vw, ${width}px` : undefined}
          decoding="async"
        />
      )}
      
      {/* Loading placeholder when not in view */}
      {!isInView && (
        <div 
          className={`${className} bg-gray-200 dark:bg-gray-700 animate-pulse`}
          style={{ width, height }}
        />
      )}
    </div>
  );
};

// Hook for preloading critical images
export const useImagePreload = (src: string) => {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [src]);
};

// Utility function to generate optimized image URLs
export const getOptimizedImageUrl = (
  src: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpg' | 'png';
  } = {}
) => {
  // This would integrate with your image optimization service
  // For now, return the original src
  // In production, you'd use services like:
  // - Cloudinary: `https://res.cloudinary.com/your-cloud/image/fetch/w_${width},q_${quality},f_${format}/${encodeURIComponent(src)}`
  // - ImageKit: `https://ik.imagekit.io/your-id/tr:w-${width},q-${quality},f-${format}/${src}`
  // - Next.js Image Optimization API
  
  return src;
}; 