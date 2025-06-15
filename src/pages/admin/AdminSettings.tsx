import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { AdminSettings, AdminSettingsService } from '../../data/adminSettings';
import { formatDateTime } from '../../utils/dateFormatter';
import { useSitemap } from '../../utils/sitemap';
import { usePosts } from '../../hooks/usePosts';

const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'features' | 'notifications' | 'security' | 'sitemap'>('general');
  
  // Sitemap functionality
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);
  const { posts } = usePosts();
  const { downloadSitemap, getSitemapXML, generateRobotsTxt } = useSitemap(
    window.location.origin
  );

  useEffect(() => {
    loadSettings();
  }, []);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const settingsService = new AdminSettingsService();
      const data = await settingsService.getAllSettings();
      
      // Load page titles from localStorage if available
      const savedPageTitles = localStorage.getItem('admin_page_titles');
      const pageTitleFields = savedPageTitles ? JSON.parse(savedPageTitles) : {};
      
      // Ensure page title fields exist with fallbacks
      const enhancedData = {
        ...data,
        general: {
          ...data.general,
          pageTitle: data.general.pageTitle || pageTitleFields.pageTitle || '',
          pageDescription: data.general.pageDescription || pageTitleFields.pageDescription || '',
          ogTitle: data.general.ogTitle || pageTitleFields.ogTitle || '',
          ogDescription: data.general.ogDescription || pageTitleFields.ogDescription || '',
          twitterTitle: data.general.twitterTitle || pageTitleFields.twitterTitle || '',
          twitterDescription: data.general.twitterDescription || pageTitleFields.twitterDescription || ''
        }
      };
      
      console.log('📖 Loaded settings:', enhancedData);
      console.log('💾 Page titles from localStorage:', pageTitleFields);
      setSettings(enhancedData);
    } catch (error) {
      console.error('Failed to load settings:', error);
      setErrorMessage('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (updates: Partial<AdminSettings>) => {
    if (!settings) return;
    
    setSaving(true);
    setErrorMessage(null);
    try {
      console.log('🔍 Attempting to save settings:', updates);
      const settingsService = new AdminSettingsService();
      
      // Temporary: Save page title fields to localStorage as backup
      if (updates.general && (
        updates.general.pageTitle !== undefined ||
        updates.general.pageDescription !== undefined ||
        updates.general.ogTitle !== undefined ||
        updates.general.ogDescription !== undefined ||
        updates.general.twitterTitle !== undefined ||
        updates.general.twitterDescription !== undefined
      )) {
        const pageFields = {
          pageTitle: updates.general.pageTitle,
          pageDescription: updates.general.pageDescription,
          ogTitle: updates.general.ogTitle,
          ogDescription: updates.general.ogDescription,
          twitterTitle: updates.general.twitterTitle,
          twitterDescription: updates.general.twitterDescription
        };
        localStorage.setItem('admin_page_titles', JSON.stringify(pageFields));
        console.log('💾 Saved page titles to localStorage:', pageFields);
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('pageTitlesUpdated'));
      }
      
      const updatedSettings = await settingsService.updateSettings(updates);
      console.log('✅ Settings saved successfully:', updatedSettings);
      
      // Merge back the page titles from localStorage if backend doesn't support them
      const mergedSettings = {
        ...updatedSettings,
        general: {
          ...updatedSettings.general,
          ...settings.general // Keep the current page title values
        }
      };
      
      setSettings(mergedSettings);
      setSuccessMessage('Settings saved successfully');
    } catch (error) {
      console.error('❌ Failed to save settings:', error);
      
      // If backend fails but we have page title fields, still save them locally
      if (updates.general && (
        updates.general.pageTitle !== undefined ||
        updates.general.pageDescription !== undefined ||
        updates.general.ogTitle !== undefined ||
        updates.general.ogDescription !== undefined ||
        updates.general.twitterTitle !== undefined ||
        updates.general.twitterDescription !== undefined
      )) {
        const pageFields = {
          pageTitle: updates.general.pageTitle,
          pageDescription: updates.general.pageDescription,
          ogTitle: updates.general.ogTitle,
          ogDescription: updates.general.ogDescription,
          twitterTitle: updates.general.twitterTitle,
          twitterDescription: updates.general.twitterDescription
        };
        localStorage.setItem('admin_page_titles', JSON.stringify(pageFields));
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('pageTitlesUpdated'));
        
        // Update local state
        const updatedSettings = {
          ...settings,
          general: {
            ...settings.general,
            ...updates.general
          }
        };
        setSettings(updatedSettings);
        setSuccessMessage('Page titles saved locally (backend update needed)');
      } else {
        setErrorMessage('Failed to save settings. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleFeatureToggle = (feature: keyof AdminSettings['features'], enabled: boolean) => {
    if (!settings) return;
    
    const updates = {
      features: { ...settings.features, [feature]: enabled }
    };
    
    setSettings({ ...settings, ...updates });
  };

  const handleResetSettings = async () => {
    if (!confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
      return;
    }
    
    setSaving(true);
    setErrorMessage(null);
    try {
      const settingsService = new AdminSettingsService();
      const defaultSettings = await settingsService.resetToDefaults();
      setSettings(defaultSettings);
      setSuccessMessage('All settings reset to defaults successfully');
    } catch (error) {
      console.error('Failed to reset settings:', error);
      setErrorMessage('Failed to reset settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Sitemap handlers
  const handleGenerateSitemap = async () => {
    setIsGenerating(true);
    try {
      await downloadSitemap(posts);
      setLastGenerated(new Date().toISOString());
      setSuccessMessage('Sitemap downloaded successfully');
    } catch (error) {
      console.error('Failed to generate sitemap:', error);
      setErrorMessage('Failed to generate sitemap. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreviewSitemap = async () => {
    try {
      const xml = await getSitemapXML(posts);
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to preview sitemap:', error);
      setErrorMessage('Failed to preview sitemap. Please try again.');
    }
  };

  const handleDownloadRobots = () => {
    try {
      const robotsTxt = generateRobotsTxt();
      const blob = new Blob([robotsTxt], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'robots.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSuccessMessage('Robots.txt downloaded successfully');
    } catch (error) {
      console.error('Failed to download robots.txt:', error);
      setErrorMessage('Failed to download robots.txt. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center space-x-2">
          <Icon icon="lucide:loader-2" className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-500 dark:text-gray-400">Loading settings...</span>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        Failed to load settings. Please try again.
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'General', icon: 'lucide:settings' },
    { id: 'features', label: 'Features', icon: 'lucide:toggle-left' },
    { id: 'notifications', label: 'Notifications', icon: 'lucide:bell' },
    { id: 'security', label: 'Security', icon: 'lucide:shield' },
    { id: 'sitemap', label: 'Sitemap', icon: 'lucide:map' }
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure global application settings and features
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {formatDateTime(settings?.updatedAt)}
          </span>
          <button
            onClick={handleResetSettings}
            disabled={saving}
            className="flex items-center space-x-2 px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
          >
            <Icon icon="lucide:rotate-ccw" className="w-4 h-4" />
            <span>Reset All</span>
          </button>
        </div>
      </div>

      {/* Settings Container */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon icon={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center">
                <Icon icon="lucide:check-circle" className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                <p className="text-sm font-medium text-green-800 dark:text-green-200">{successMessage}</p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center">
                <Icon icon="lucide:alert-circle" className="w-5 h-5 text-red-600 dark:text-red-400 mr-3" />
                <p className="text-sm font-medium text-red-800 dark:text-red-200">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">General Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={settings.general.siteName}
                      onChange={(e) => {
                        const updatedSettings = {
                          general: { ...settings.general, siteName: e.target.value }
                        };
                        setSettings({ ...settings, ...updatedSettings });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Site Description
                    </label>
                    <textarea
                      value={settings.general.siteDescription}
                      onChange={(e) => {
                        const updatedSettings = {
                          general: { ...settings.general, siteDescription: e.target.value }
                        };
                        setSettings({ ...settings, ...updatedSettings });
                      }}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* Page Title & SEO Section */}
                <div className="mt-6">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Icon icon="lucide:type" className="w-4 h-4 mr-2" />
                    Page Title & SEO
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Configure the main page title and SEO meta tags that appear in browser tabs and search results
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Page Title (Browser Tab)
                      </label>
                      <input
                        type="text"
                        value={settings.general.pageTitle || ''}
                        onChange={(e) => {
                          const updatedSettings = {
                            general: { ...settings.general, pageTitle: e.target.value }
                          };
                          setSettings({ ...settings, ...updatedSettings });
                        }}
                        
                        placeholder="e.g., John Doe - Senior Software Engineer | Full-Stack Development"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        This will appear in the browser tab and as the main page title
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Page Meta Description
                      </label>
                      <textarea
                        value={settings.general.pageDescription || ''}
                        onChange={(e) => {
                          const updatedSettings = {
                            general: { ...settings.general, pageDescription: e.target.value }
                          };
                          setSettings({ ...settings, ...updatedSettings });
                        }}
                        
                        placeholder="A brief description that appears in search engine results (150-160 characters recommended)"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Used in search engine results and social media previews
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Open Graph Title (Optional)
                      </label>
                      <input
                        type="text"
                        value={settings.general.ogTitle || ''}
                        onChange={(e) => {
                          const updatedSettings = {
                            general: { ...settings.general, ogTitle: e.target.value }
                          };
                          setSettings({ ...settings, ...updatedSettings });
                        }}
                        
                        placeholder="Leave empty to use Page Title"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Title for Facebook and other social platforms
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Twitter Title (Optional)
                      </label>
                      <input
                        type="text"
                        value={settings.general.twitterTitle || ''}
                        onChange={(e) => {
                          const updatedSettings = {
                            general: { ...settings.general, twitterTitle: e.target.value }
                          };
                          setSettings({ ...settings, ...updatedSettings });
                        }}
                        
                        placeholder="Leave empty to use Page Title"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Title for Twitter/X platform
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Open Graph Description (Optional)
                      </label>
                      <textarea
                        value={settings.general.ogDescription || ''}
                        onChange={(e) => {
                          const updatedSettings = {
                            general: { ...settings.general, ogDescription: e.target.value }
                          };
                          setSettings({ ...settings, ...updatedSettings });
                        }}
                        
                        placeholder="Leave empty to use Page Description"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Twitter Description (Optional)
                      </label>
                      <textarea
                        value={settings.general.twitterDescription || ''}
                        onChange={(e) => {
                          const updatedSettings = {
                            general: { ...settings.general, twitterDescription: e.target.value }
                          };
                          setSettings({ ...settings, ...updatedSettings });
                        }}
                        
                        placeholder="Leave empty to use Page Description"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Maintenance Mode</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Enable Maintenance Mode</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      When enabled, visitors will see a maintenance message
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.general.maintenanceMode}
                      onChange={(e) => {
                        const updatedSettings = {
                          general: { ...settings.general, maintenanceMode: e.target.checked }
                        };
                        setSettings({ ...settings, ...updatedSettings });
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                {settings.general.maintenanceMode && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Maintenance Message
                    </label>
                    <textarea
                      value={settings.general.maintenanceMessage}
                      onChange={(e) => {
                        const updatedSettings = {
                          general: { ...settings.general, maintenanceMessage: e.target.value }
                        };
                        setSettings({ ...settings, ...updatedSettings });
                      }}
                      
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Social Media Links</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Configure your social media profiles and contact information
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(settings.general.social_media_links || {}).map(([platform, url]) => {
                    const platformLabels: Record<string, { label: string; icon: string; placeholder: string }> = {
                      github: { label: 'GitHub', icon: 'lucide:github', placeholder: 'https://github.com/username' },
                      linkedin: { label: 'LinkedIn', icon: 'lucide:linkedin', placeholder: 'https://linkedin.com/in/username' },
                      x: { label: 'X (Twitter)', icon: 'lucide:twitter', placeholder: 'https://x.com/username' },
                      facebook: { label: 'Facebook', icon: 'lucide:facebook', placeholder: 'https://facebook.com/username' },
                      instagram: { label: 'Instagram', icon: 'lucide:instagram', placeholder: 'https://instagram.com/username' },
                      email: { label: 'Email', icon: 'lucide:mail', placeholder: 'your@email.com' }
                    };

                    const platformInfo = platformLabels[platform] || {
                      label: platform.charAt(0).toUpperCase() + platform.slice(1),
                      icon: 'lucide:link',
                      placeholder: 'https://example.com'
                    };

                    return (
                      <div key={platform}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <div className="flex items-center space-x-2">
                            <Icon icon={platformInfo.icon} className="w-4 h-4" />
                            <span>{platformInfo.label}</span>
                          </div>
                        </label>
                        <input
                          type={platform === 'email' ? 'email' : 'url'}
                          value={url || ''}
                          onChange={(e) => {
                            const updatedSettings = {
                              general: {
                                ...settings.general,
                                social_media_links: {
                                  ...settings.general.social_media_links,
                                  [platform]: e.target.value
                                }
                              }
                            };
                            setSettings({ ...settings, ...updatedSettings });
                          }}
                          
                          placeholder={platformInfo.placeholder}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Resume Information</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Manage your resume download link
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <div className="flex items-center space-x-2">
                        <Icon icon="lucide:download" className="w-4 h-4" />
                        <span>Resume Download Link</span>
                      </div>
                    </label>
                    <input
                      type="url"
                      value={settings.general.files?.resume_links || ''}
                      onChange={(e) => {
                        const updatedSettings = {
                          general: {
                            ...settings.general,
                            files: {
                              ...settings.general.files,
                              resume_links: e.target.value
                            }
                          }
                        };
                        setSettings({ ...settings, ...updatedSettings });
                      }}
                      
                      placeholder="https://drive.google.com/your-resume-link"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      This link will be used for the "Download Resume" button in the Hero section
                    </p>
                  </div>
                </div>
              </div>

              {/* Save Button for General Settings */}
              <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleSaveSettings({ general: settings.general })}
                  disabled={saving}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Icon icon="lucide:save" className="w-4 h-4" />
                      <span>Save General Settings</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Feature Settings */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Feature Controls</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Enable or disable specific features across the entire application
                </p>
              </div>

              <div className="space-y-4">
                {Object.entries(settings.features).filter(([feature]) => {
                  const featureLabels: Record<string, { label: string; description: string; icon: string; order: number }> = {
                    commentsEnabled: {
                      label: 'Comments System',
                      description: 'Allow visitors to comment on blog posts',
                      icon: 'lucide:message-circle',
                      order: 1
                    },
                    blogEnabled: {
                      label: 'Blog Section',
                      description: 'Enable the blog functionality',
                      icon: 'lucide:edit-3',
                      order: 2
                    },
                    portfolioEnabled: {
                      label: 'Portfolio Section',
                      description: 'Display portfolio projects on the website',
                      icon: 'lucide:folder',
                      order: 3
                    },
                    servicesEnabled: {
                      label: 'Services Section',
                      description: 'Show available services and offerings',
                      icon: 'lucide:briefcase',
                      order: 4
                    }
                  };
                  return feature in featureLabels;
                }).sort(([featureA], [featureB]) => {
                  const featureLabels: Record<string, { order: number }> = {
                    commentsEnabled: { order: 1 },
                    blogEnabled: { order: 2 },
                    portfolioEnabled: { order: 3 },
                    servicesEnabled: { order: 4 }
                  };
                  return (featureLabels[featureA]?.order || 999) - (featureLabels[featureB]?.order || 999);
                }).map(([feature, enabled]) => {
                  const featureLabels: Record<string, { label: string; description: string; icon: string }> = {
                    commentsEnabled: {
                      label: 'Comments System',
                      description: 'Allow visitors to comment on blog posts',
                      icon: 'lucide:message-circle'
                    },
                    blogEnabled: {
                      label: 'Blog Section',
                      description: 'Enable the blog functionality',
                      icon: 'lucide:edit-3'
                    },
                    portfolioEnabled: {
                      label: 'Portfolio Section',
                      description: 'Display portfolio projects on the website',
                      icon: 'lucide:folder'
                    },
                    servicesEnabled: {
                      label: 'Services Section',
                      description: 'Show available services and offerings',
                      icon: 'lucide:briefcase'
                    }
                  };

                  const featureInfo = featureLabels[feature] || {
                    label: feature,
                    description: `Toggle ${feature}`,
                    icon: 'lucide:toggle-left'
                  };

                  return (
                    <div key={feature} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon icon={featureInfo.icon} className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {featureInfo.label}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {featureInfo.description}
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => handleFeatureToggle(feature as keyof AdminSettings['features'], e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  );
                })}
              </div>

              {/* Save Button for Features */}
              <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleSaveSettings({ features: settings.features })}
                  disabled={saving}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Icon icon="lucide:save" className="w-4 h-4" />
                      <span>Save Feature Settings</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Settings</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Configure email and Telegram notifications for your portfolio
                </p>
              </div>

              {/* Email Notifications */}
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Icon icon="lucide:mail" className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white">Email Notifications</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive notifications via email
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications?.emailNotifications || false}
                                             onChange={(e) => {
                         const updates = {
                           notifications: { ...settings.notifications, emailNotifications: e.target.checked }
                         };
                         setSettings({ ...settings, ...updates });
                       }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {settings.notifications?.emailNotifications && (
                  <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          SMTP Host
                        </label>
                        <input
                          type="text"
                          value={settings.notifications?.smtpHost || ''}
                          onChange={(e) => {
                            const updates = {
                              notifications: { ...settings.notifications, smtpHost: e.target.value }
                            };
                            setSettings({ ...settings, ...updates });
                          }}
                          
                          placeholder="smtp.gmail.com"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          SMTP Port
                        </label>
                        <input
                          type="number"
                          value={settings.notifications?.smtpPort || ''}
                          onChange={(e) => {
                            const updates = {
                              notifications: { ...settings.notifications, smtpPort: parseInt(e.target.value) || 587 }
                            };
                            setSettings({ ...settings, ...updates });
                          }}
                          
                          placeholder="587"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          SMTP Username
                        </label>
                        <input
                          type="email"
                          value={settings.notifications?.smtpUsername || ''}
                          onChange={(e) => {
                            const updates = {
                              notifications: { ...settings.notifications, smtpUsername: e.target.value }
                            };
                            setSettings({ ...settings, ...updates });
                          }}
                          
                          placeholder="your-email@gmail.com"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          SMTP Password
                        </label>
                        <input
                          type="password"
                          value={settings.notifications?.smtpPassword || ''}
                          onChange={(e) => {
                            const updates = {
                              notifications: { ...settings.notifications, smtpPassword: e.target.value }
                            };
                            setSettings({ ...settings, ...updates });
                          }}
                          
                          placeholder="your-app-password"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Telegram Notifications */}
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Icon icon="lucide:send" className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white">Telegram Notifications</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive notifications via Telegram bot
                        </p>
                    </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                       checked={settings.notifications?.telegramNotifications || false}
                          onChange={(e) => {
                            const updates = {
                           notifications: { ...settings.notifications, telegramNotifications: e.target.checked }
                            };
                         setSettings({ ...settings, ...updates });
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                {settings.notifications?.telegramNotifications && (
                  <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Bot Token
                        </label>
                        <input
                          type="password"
                          value={settings.notifications?.telegramBotToken || ''}
                          onChange={(e) => {
                            const updates = {
                              notifications: { ...settings.notifications, telegramBotToken: e.target.value }
                            };
                            setSettings({ ...settings, ...updates });
                          }}
                          
                          placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Get this from @BotFather on Telegram
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Chat ID
                        </label>
                        <input
                          type="text"
                          value={settings.notifications?.telegramChatId || ''}
                          onChange={(e) => {
                            const updates = {
                              notifications: { ...settings.notifications, telegramChatId: e.target.value }
                            };
                            setSettings({ ...settings, ...updates });
                          }}
                          
                          placeholder="123456789"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Your personal chat ID or group chat ID
                        </p>
                      </div>
                    </div>
                  </div>
                )}
               </div>

               {/* Save Button for Notifications */}
               <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                 <button
                   onClick={() => handleSaveSettings({ notifications: settings.notifications })}
                   disabled={saving}
                   className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {saving ? (
                     <>
                       <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" />
                       <span>Saving...</span>
                     </>
                   ) : (
                     <>
                       <Icon icon="lucide:save" className="w-4 h-4" />
                       <span>Save Notification Settings</span>
                     </>
                   )}
                 </button>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Settings</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Configure security and authentication settings
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="480"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => {
                        const updates = {
                          security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
                        };
                        setSettings({ ...settings, ...updates });
                      }}
                      
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Max Login Attempts
                    </label>
                    <input
                      type="number"
                      min="3"
                      max="10"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => {
                        const updates = {
                          security: { ...settings.security, maxLoginAttempts: parseInt(e.target.value) }
                        };
                        setSettings({ ...settings, ...updates });
                      }}
                      
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Require Strong Passwords
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Enforce strong password requirements for all users
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.security.requireStrongPasswords}
                        onChange={(e) => {
                          const updates = {
                            security: { ...settings.security, requireStrongPasswords: e.target.checked }
                          };
                          setSettings({ ...settings, ...updates });
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Two-Factor Authentication
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Enable 2FA for additional security (coming soon)
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.security.twoFactorEnabled}
                        onChange={(e) => {
                          const updates = {
                            security: { ...settings.security, twoFactorEnabled: e.target.checked }
                          };
                          setSettings({ ...settings, ...updates });
                        }}
                        className="sr-only peer"
                        disabled
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 opacity-50"></div>
                    </label>
                  </div>
                </div>

                {/* Comment Rate Limiting Section */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Comment Rate Limiting</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Configure rate limiting for comment submissions to prevent spam
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Enable Comment Rate Limiting
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Limit the number of comments users can submit per time period
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.security.commentRateLimit?.enabled || false}
                        onChange={(e) => {
                          const updates = {
                            security: { 
                              ...settings.security, 
                              commentRateLimit: {
                                ...settings.security.commentRateLimit,
                                enabled: e.target.checked
                              }
                            }
                          };
                          setSettings({ ...settings, ...updates });
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {settings.security.commentRateLimit?.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Max Comments per Hour
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={settings.security.commentRateLimit?.maxCommentsPerHour || 10}
                          onChange={(e) => {
                            const updates = {
                              security: { 
                                ...settings.security, 
                                commentRateLimit: {
                                  ...settings.security.commentRateLimit,
                                  maxCommentsPerHour: parseInt(e.target.value) || 10
                                }
                              }
                            };
                            setSettings({ ...settings, ...updates });
                          }}
                          
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Maximum comments allowed per hour from the same IP
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Max Comments per Minute
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={settings.security.commentRateLimit?.maxCommentsPerMinute || 2}
                          onChange={(e) => {
                            const updates = {
                              security: { 
                                ...settings.security, 
                                commentRateLimit: {
                                  ...settings.security.commentRateLimit,
                                  maxCommentsPerMinute: parseInt(e.target.value) || 2
                                }
                              }
                            };
                            setSettings({ ...settings, ...updates });
                          }}
                          
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Maximum comments allowed per minute from the same IP
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Minute Window
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={settings.security.commentRateLimit?.minuteWindow || 1}
                          onChange={(e) => {
                            const updates = {
                              security: { 
                                ...settings.security, 
                                commentRateLimit: {
                                  ...settings.security.commentRateLimit,
                                  minuteWindow: parseInt(e.target.value) || 1
                                }
                              }
                            };
                            setSettings({ ...settings, ...updates });
                          }}
                          
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Time window in minutes for rate limiting
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Comment Approval Section */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Comment Approval</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Configure whether all comments require manual approval before being published
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Require Comment Approval
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        When enabled, all comments must be manually approved before being published
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.security.commentApprovalRequired || false}
                        onChange={(e) => {
                          const updates = {
                            security: { 
                              ...settings.security, 
                              commentApprovalRequired: e.target.checked
                            }
                          };
                          setSettings({ ...settings, ...updates });
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {settings.security.commentApprovalRequired && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-start">
                        <Icon icon="lucide:info" className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                            Comment Approval Enabled
                          </p>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                            All new comments will be held for moderation and must be manually approved in the Comments section before they appear on your site. This overrides any automatic approval rules.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Save Button for Security Settings */}
                <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleSaveSettings({ security: settings.security })}
                    disabled={saving}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Icon icon="lucide:save" className="w-4 h-4" />
                        <span>Save Security Settings</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sitemap Management */}
          {activeTab === 'sitemap' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sitemap Management</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Generate and download XML sitemaps and robots.txt files for search engine optimization
                </p>
              </div>

              {/* Sitemap Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={handleGenerateSitemap}
                  disabled={isGenerating}
                  className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isGenerating ? (
                    <Icon icon="lucide:loader-2" className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Icon icon="lucide:download" className="w-4 h-4 mr-2" />
                  )}
                  {isGenerating ? 'Generating...' : 'Download Sitemap'}
                </button>

                <button
                  onClick={handlePreviewSitemap}
                  className="flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  <Icon icon="lucide:eye" className="w-4 h-4 mr-2" />
                  Preview Sitemap
                </button>

                <button
                  onClick={handleDownloadRobots}
                  className="flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  <Icon icon="lucide:file-text" className="w-4 h-4 mr-2" />
                  Download Robots.txt
                </button>
              </div>

              {/* Sitemap Information */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Icon icon="lucide:info" className="w-4 h-4 mr-2" />
                  Sitemap Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content Summary</p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Total pages: {posts.length + 6}</li>
                      <li>• Static pages: 6 (Home, About, Portfolio, Services, Blog, Contact)</li>
                      <li>• Blog posts: {posts.length} published articles</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Generated</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {lastGenerated ? new Date(lastGenerated).toLocaleString() : 'Never'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Sitemap updates automatically when new content is published
                    </p>
                  </div>
                </div>
              </div>

              {/* SEO Tips */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-3 flex items-center">
                  <Icon icon="lucide:lightbulb" className="w-4 h-4 mr-2" />
                  SEO Best Practices
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Sitemap Tips</p>
                    <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                      <li>• Submit sitemap to Google Search Console</li>
                      <li>• Update sitemap when adding new content</li>
                      <li>• Keep sitemap under 50,000 URLs</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Robots.txt Tips</p>
                    <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                      <li>• Place robots.txt in your site root</li>
                      <li>• Include sitemap URL in robots.txt</li>
                      <li>• Block admin and API directories</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Indicator */}
      {saving && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" />
          <span>Saving changes...</span>
        </div>
      )}
    </div>
  );
};

export default AdminSettingsPage; 