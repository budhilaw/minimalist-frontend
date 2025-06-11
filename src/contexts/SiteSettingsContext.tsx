import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

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
      
      const response = await fetch('/api/v1/settings/public');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: PublicSettings = await response.json();
      setSettings(data);
      
      // Update document title with site name
      if (data.site.site_name) {
        document.title = data.site.site_name;
      }
    } catch (err) {
      console.error('Failed to fetch site settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
      // Keep using default settings on error
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
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