import { useState, useEffect } from 'react';
import { PortfolioService } from '../services/portfolioService';
import { ServiceService } from '../services/serviceService';
import { BlogService } from '../services/blogService';

interface ContentAvailability {
  hasPortfolio: boolean;
  hasServices: boolean;
  hasPosts: boolean;
  loading: boolean;
}

export const useContentAvailability = () => {
  const [availability, setAvailability] = useState<ContentAvailability>({
    hasPortfolio: false,
    hasServices: false,
    hasPosts: false,
    loading: true,
  });

  useEffect(() => {
    const checkContentAvailability = async () => {
      try {
        // Check for portfolio projects (limit 1 just to see if any exist)
        const portfolioResponse = await PortfolioService.getAllProjects({ limit: 1 });
        const hasPortfolio = !portfolioResponse.error && portfolioResponse.data && portfolioResponse.data.projects.length > 0;

        // Check for active services (limit 1 just to see if any exist)
        const servicesResponse = await ServiceService.getActiveServices();
        const hasServices = !servicesResponse.error && servicesResponse.data && servicesResponse.data.services.length > 0;

        // Check for published posts (limit 1 just to see if any exist)
        const postsResponse = await BlogService.getPublishedPosts({ limit: 1 });
        const hasPosts = !postsResponse.error && postsResponse.data && postsResponse.data.posts.length > 0;

        setAvailability({
          hasPortfolio: hasPortfolio || false,
          hasServices: hasServices || false,
          hasPosts: hasPosts || false,
          loading: false,
        });
      } catch (error) {
        console.error('Error checking content availability:', error);
        setAvailability({
          hasPortfolio: false,
          hasServices: false,
          hasPosts: false,
          loading: false,
        });
      }
    };

    checkContentAvailability();
  }, []);

  return availability;
}; 