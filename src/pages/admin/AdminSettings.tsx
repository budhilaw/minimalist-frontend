import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { AdminSettings, AdminSettingsService } from '../../data/adminSettings';
import { formatDateTime } from '../../utils/dateFormatter';

const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'features' | 'notifications' | 'security'>('general');

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

  const handleFeatureToggle = async (feature: keyof AdminSettings['features'], enabled: boolean) => {
    if (!settings) return;
    
    const updates = {
      features: { ...settings.features, [feature]: enabled }
    };
    
    await handleSaveSettings(updates);
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
    { id: 'security', label: 'Security', icon: 'lucide:shield' }
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
                      onBlur={() => handleSaveSettings({ general: settings.general })}
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
                      onBlur={() => handleSaveSettings({ general: settings.general })}
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
                        onBlur={() => handleSaveSettings({ general: settings.general })}
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
                        onBlur={() => handleSaveSettings({ general: settings.general })}
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
                        onBlur={() => handleSaveSettings({ general: settings.general })}
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
                        onBlur={() => handleSaveSettings({ general: settings.general })}
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
                        onBlur={() => handleSaveSettings({ general: settings.general })}
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
                        onBlur={() => handleSaveSettings({ general: settings.general })}
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
                        handleSaveSettings(updatedSettings);
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
                      onBlur={() => handleSaveSettings({ general: settings.general })}
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
                          onBlur={() => handleSaveSettings({ general: settings.general })}
                          placeholder={platformInfo.placeholder}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Profile & Media</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Manage your profile photo and media files
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <div className="flex items-center space-x-2">
                        <Icon icon="lucide:user-circle" className="w-4 h-4" />
                        <span>Profile Photo URL</span>
                      </div>
                    </label>
                    <input
                      type="url"
                      value={settings.general.photo_profile || ''}
                      onChange={(e) => {
                        const updatedSettings = {
                          general: { ...settings.general, photo_profile: e.target.value }
                        };
                        setSettings({ ...settings, ...updatedSettings });
                      }}
                      onBlur={() => handleSaveSettings({ general: settings.general })}
                      placeholder="https://imgur.com/your-photo.jpg (leave empty to use emoji)"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Leave empty to use the default emoji (👨‍💻) in Hero section
                    </p>
                  </div>

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
                      onBlur={() => handleSaveSettings({ general: settings.general })}
                      placeholder="https://drive.google.com/your-resume-link"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      This link will be used for the "Download Resume" button in the Hero section
                    </p>
                  </div>
                </div>
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
                {Object.entries(settings.features).map(([feature, enabled]) => {
                  const featureLabels: Record<string, { label: string; description: string; icon: string }> = {
                    commentsEnabled: {
                      label: 'Comments System',
                      description: 'Allow visitors to comment on blog posts',
                      icon: 'lucide:message-circle'
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
                    },
                    blogEnabled: {
                      label: 'Blog Section',
                      description: 'Enable the blog functionality',
                      icon: 'lucide:edit-3'
                    },
                    contactFormEnabled: {
                      label: 'Contact Form',
                      description: 'Allow visitors to send messages via contact form',
                      icon: 'lucide:mail'
                    },
                    searchEnabled: {
                      label: 'Search Functionality',
                      description: 'Enable search across the website content',
                      icon: 'lucide:search'
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
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Preferences</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Configure how and when you receive notifications
                </p>
              </div>

              <div className="space-y-4">
                {Object.entries(settings.notifications).map(([notification, enabled]) => {
                  const notificationLabels: Record<string, { label: string; description: string }> = {
                    emailNotifications: {
                      label: 'Email Notifications',
                      description: 'Receive notifications via email'
                    },
                    newCommentNotifications: {
                      label: 'New Comment Alerts',
                      description: 'Get notified when someone comments on your posts'
                    },
                    newContactFormNotifications: {
                      label: 'Contact Form Submissions',
                      description: 'Get notified about new contact form messages'
                    },
                    systemAlertNotifications: {
                      label: 'System Alerts',
                      description: 'Receive notifications about system events and errors'
                    }
                  };

                  const notificationInfo = notificationLabels[notification] || {
                    label: notification,
                    description: `Toggle ${notification}`
                  };

                  return (
                    <div key={notification} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {notificationInfo.label}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {notificationInfo.description}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => {
                            const updates = {
                              notifications: { ...settings.notifications, [notification]: e.target.checked }
                            };
                            handleSaveSettings(updates);
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  );
                })}
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
                      onBlur={() => handleSaveSettings({ security: settings.security })}
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
                      onBlur={() => handleSaveSettings({ security: settings.security })}
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
                          handleSaveSettings(updates);
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
                          handleSaveSettings(updates);
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
                          handleSaveSettings(updates);
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
                          onBlur={() => handleSaveSettings({ security: settings.security })}
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
                          onBlur={() => handleSaveSettings({ security: settings.security })}
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
                          onBlur={() => handleSaveSettings({ security: settings.security })}
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
                          handleSaveSettings(updates);
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