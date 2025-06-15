import { useState, useEffect } from 'react';
import { PortfolioService } from '../services/portfolioService';
import { ServiceService } from '../services/serviceService';
import { BlogService } from '../services/blogService';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

interface ContentAvailability {
  hasPortfolio: boolean;
  hasServices: boolean;
  hasPosts: boolean;
  loading: boolean;
}

export const useContentAvailability = () => {
  const { settings, loading: settingsLoading } = useSiteSettings();
  const [availability, setAvailability] = useState<ContentAvailability>({
    hasPortfolio: false,
    hasServices: false,
    hasPosts: false,
    loading: true,
  });

  useEffect(() => {
    const checkContentAvailability = async () => {
      // Wait for settings to load first
      if (settingsLoading || !settings) {
        return;
      }

      try {
        // Check feature toggles first - if disabled, don't show regardless of content
        const portfolioEnabled = settings.features.portfolio_enabled;
        const servicesEnabled = settings.features.services_enabled;
        const blogEnabled = settings.features.blog_enabled;

        let hasPortfolio = false;
        let hasServices = false;
        let hasPosts = false;

        // Only check for content if the feature is enabled
        if (portfolioEnabled) {
          const portfolioResponse = await PortfolioService.getAllProjects({ limit: 1 });
          hasPortfolio = !portfolioResponse.error && portfolioResponse.data && portfolioResponse.data.projects.length > 0;
        }

        if (servicesEnabled) {
          const servicesResponse = await ServiceService.getActiveServices();
          hasServices = !servicesResponse.error && servicesResponse.data && servicesResponse.data.services.length > 0;
        }

        if (blogEnabled) {
          const postsResponse = await BlogService.getPublishedPosts({ limit: 1 });
          hasPosts = !postsResponse.error && postsResponse.data && postsResponse.data.posts.length > 0;
        }

        setAvailability({
          hasPortfolio,
          hasServices,
          hasPosts,
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
  }, [settings, settingsLoading]);

  return availability;
}; 