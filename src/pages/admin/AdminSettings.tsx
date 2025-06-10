import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { AdminSettings, SettingsService } from '../../data/settings';
import { useAdminActions } from '../../contexts/NotificationContext';

const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'features' | 'notifications' | 'security'>('general');
  const { logAdminAction } = useAdminActions();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const settingsService = SettingsService.getInstance();
      const data = await settingsService.getAllSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (updates: Partial<AdminSettings>) => {
    if (!settings) return;
    
    setSaving(true);
    try {
      const settingsService = SettingsService.getInstance();
      const updatedSettings = await settingsService.updateSettings(updates);
      setSettings(updatedSettings);
      
      await logAdminAction({
        action: 'settings_updated',
        resourceType: 'settings',
        success: true,
        details: `Settings updated in ${activeTab} section`
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      await logAdminAction({
        action: 'settings_updated',
        resourceType: 'settings',
        success: false,
        details: `Failed to update settings: ${error}`
      });
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
    try {
      const settingsService = SettingsService.getInstance();
      const defaultSettings = await settingsService.resetToDefaults();
      setSettings(defaultSettings);
      
      await logAdminAction({
        action: 'settings_updated',
        resourceType: 'settings',
        success: true,
        details: 'All settings reset to defaults'
      });
    } catch (error) {
      console.error('Failed to reset settings:', error);
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
            Last updated: {new Date(settings.updatedAt).toLocaleString()}
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