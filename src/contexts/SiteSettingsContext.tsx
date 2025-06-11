import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SettingsService, GeneralSettings, FeatureSettings } from '../data/settings';

interface SiteSettings {
  general: GeneralSettings;
  features: FeatureSettings;
}

interface SiteSettingsContextType {
  settings: SiteSettings | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const defaultSettings: SiteSettings = {
  general: {
    siteName: 'Portfolio',
    siteDescription: 'Personal portfolio and blog',
    maintenanceMode: false,
    maintenanceMessage: ''
  },
  features: {
    commentsEnabled: true,
    portfolioEnabled: true,
    servicesEnabled: true,
    blogEnabled: true,
    contactFormEnabled: true,
    searchEnabled: true
  }
};

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

interface SiteSettingsProviderProps {
  children: ReactNode;
}

export const SiteSettingsProvider: React.FC<SiteSettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const settingsService = SettingsService.getInstance();
      const fetchedSettings = await settingsService.getPublicSettings();
      
      setSettings(fetchedSettings);
    } catch (err) {
      console.warn('Failed to fetch site settings, using defaults:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
      // Use default settings if API fails
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const refresh = async () => {
    await fetchSettings();
  };

  // Update document title when settings change
  useEffect(() => {
    if (settings?.general?.siteName) {
      document.title = settings.general.siteName;
    }
  }, [settings?.general?.siteName]);

  const value: SiteSettingsContextType = {
    settings,
    loading,
    error,
    refresh
  };

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = (): SiteSettingsContextType => {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};

// Hook to get specific setting values with fallbacks
export const useSiteSetting = <T,>(
  path: string,
  fallback: T
): T => {
  const { settings } = useSiteSettings();
  
  if (!settings) return fallback;
  
  // Simple path resolution (e.g., 'general.siteName')
  const pathArray = path.split('.');
  let value: any = settings;
  
  for (const key of pathArray) {
    value = value?.[key];
    if (value === undefined) break;
  }
  
  return value !== undefined ? value : fallback;
}; 