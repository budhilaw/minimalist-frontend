import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Multiple methods to ensure scroll to top works across different browsers and scenarios
    const scrollToTop = () => {
      // Method 1: Standard window.scrollTo
      window.scrollTo(0, 0);
      
      // Method 2: Fallback for document.documentElement
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      
      // Method 3: Fallback for document.body
      if (document.body) {
        document.body.scrollTop = 0;
      }
    };

    // Immediate scroll
    scrollToTop();
    
    // Also try after a small delay to handle any async rendering
    const timeoutId = setTimeout(scrollToTop, 10);
    
    return () => clearTimeout(timeoutId);
  }, [pathname]);
}; 