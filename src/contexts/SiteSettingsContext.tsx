import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Public settings interface (matches backend PublicSettingsResponse)
interface SocialMediaLinks {
  github?: string;
  linkedin?: string;
  x?: string;
  facebook?: string;
  instagram?: string;
  email?: string;
}

interface FilesSettings {
  resume_links?: string;
}

interface PublicSiteSettings {
  site_name: string;
  site_description: string;
  page_title?: string;
  page_description?: string;
  og_title?: string;
  og_description?: string;
  twitter_title?: string;
  twitter_description?: string;
  maintenance_mode: boolean;
  maintenance_message?: string;
  photo_profile?: string;
  social_media_links: SocialMediaLinks;
  files: FilesSettings;
}

interface PublicFeatureSettings {
  portfolio_enabled: boolean;
  services_enabled: boolean;
  blog_enabled: boolean;
  contact_form_enabled: boolean;
  comments_enabled: boolean;
}

interface PublicSettings {
  site: PublicSiteSettings;
  features: PublicFeatureSettings;
}

interface SiteSettingsContextType {
  settings: PublicSettings | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const defaultSettings: PublicSettings = {
  site: {
    site_name: 'Ericsson Budhilaw',
    site_description: 'Senior Software Engineer specializing in consulting and freelancing',
    maintenance_mode: false,
    photo_profile: undefined,
    social_media_links: {
      github: 'https://github.com/budhilaw',
      linkedin: 'https://linkedin.com/in/budhilaw',
      x: 'https://x.com/ceritaeric',
      facebook: 'https://facebook.com/ceritaeric',
      instagram: 'https://instagram.com/ceritaeric',
      email: 'ericsson@budhilaw.com'
    },
    files: {
      resume_links: 'https://drive.google.com/',
    },
  },
  features: {
    portfolio_enabled: true,
    services_enabled: true,
    blog_enabled: true,
    contact_form_enabled: true,
    comments_enabled: true,
  },
};

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: defaultSettings,
  loading: false,
  error: null,
  refetch: () => {},
});

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};

export const useSiteSetting = <T,>(
  path: string,
  fallback: T
): T => {
  const { settings } = useSiteSettings();
  
  if (!settings) return fallback;
  
  try {
    const keys = path.split('.');
    let value: any = settings;
    
    for (const key of keys) {
      value = value?.[key];
    }
    
    return value !== undefined ? value : fallback;
  } catch {
    return fallback;
  }
};

interface SiteSettingsProviderProps {
  children: ReactNode;
}

export const SiteSettingsProvider: React.FC<SiteSettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<PublicSettings | null>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/settings/public`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: PublicSettings = await response.json();
      
      // Load page titles from localStorage if backend doesn't support them yet
      const savedPageTitles = localStorage.getItem('admin_page_titles');
      const pageTitleFields = savedPageTitles ? JSON.parse(savedPageTitles) : {};
      
      // Merge localStorage page titles with backend data
      const enhancedData: PublicSettings = {
        ...data,
        site: {
          ...data.site,
          page_title: data.site.page_title || pageTitleFields.pageTitle || undefined,
          page_description: data.site.page_description || pageTitleFields.pageDescription || undefined,
          og_title: data.site.og_title || pageTitleFields.ogTitle || undefined,
          og_description: data.site.og_description || pageTitleFields.ogDescription || undefined,
          twitter_title: data.site.twitter_title || pageTitleFields.twitterTitle || undefined,
          twitter_description: data.site.twitter_description || pageTitleFields.twitterDescription || undefined
        }
      };
      
      setSettings(enhancedData);
      
      // Update document title with configured page title or site name
      const pageTitle = enhancedData.site.page_title || enhancedData.site.site_name;
      if (pageTitle) {
        document.title = pageTitle;
      }
      
      console.log('🔍 SiteSettings loaded with page titles:', {
        backend: data.site,
        localStorage: pageTitleFields,
        final: enhancedData.site
      });
      
    } catch (err) {
      console.error('Failed to fetch site settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
      
      // On error, still try to use localStorage page titles with default settings
      const savedPageTitles = localStorage.getItem('admin_page_titles');
      const pageTitleFields = savedPageTitles ? JSON.parse(savedPageTitles) : {};
      
      const fallbackSettings = {
        ...defaultSettings,
        site: {
          ...defaultSettings.site,
          page_title: pageTitleFields.pageTitle || undefined,
          page_description: pageTitleFields.pageDescription || undefined,
          og_title: pageTitleFields.ogTitle || undefined,
          og_description: pageTitleFields.ogDescription || undefined,
          twitter_title: pageTitleFields.twitterTitle || undefined,
          twitter_description: pageTitleFields.twitterDescription || undefined
        }
      };
      
      setSettings(fallbackSettings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    
    // Listen for localStorage changes (when admin saves page titles)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin_page_titles') {
        console.log('📱 Page titles updated in localStorage, refreshing settings...');
        fetchSettings();
      }
    };
    
    // Listen for custom event (for same-tab updates)
    const handlePageTitlesUpdate = () => {
      console.log('📱 Page titles updated via custom event, refreshing settings...');
      fetchSettings();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('pageTitlesUpdated', handlePageTitlesUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('pageTitlesUpdated', handlePageTitlesUpdate);
    };
  }, []);

  const value = {
    settings,
    loading,
    error,
    refetch: fetchSettings,
  };

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}; 