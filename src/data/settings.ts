const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080/api/v1';

export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

export interface FeatureSettings {
  commentsEnabled: boolean;
  portfolioEnabled: boolean;
  servicesEnabled: boolean;
  blogEnabled: boolean;
  contactFormEnabled: boolean;
  searchEnabled: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  newCommentNotifications: boolean;
  newContactFormNotifications: boolean;
  systemAlertNotifications: boolean;
}

export interface SecuritySettings {
  requireStrongPasswords: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  twoFactorEnabled: boolean;
  ipWhitelist: string[];
}

export interface AdminSettings {
  id: string;
  general: GeneralSettings;
  features: FeatureSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
  updatedAt: string;
  updatedBy?: string;
}

export interface UpdateSettingsRequest {
  general?: GeneralSettings;
  features?: FeatureSettings;
  notifications?: NotificationSettings;
  security?: SecuritySettings;
}

export class SettingsService {
  private static instance: SettingsService;

  static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService();
    }
    return SettingsService.instance;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private transformSettings(apiSettings: any): AdminSettings {
    return {
      id: apiSettings.id,
      general: apiSettings.general,
      features: apiSettings.features,
      notifications: apiSettings.notifications,
      security: apiSettings.security,
      updatedAt: apiSettings.updated_at,
      updatedBy: apiSettings.updated_by
    };
  }

  async getAllSettings(): Promise<AdminSettings> {
    const response = await fetch(`${API_BASE_URL}/admin/settings`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch settings: ${response.statusText}`);
    }

    const data = await response.json();
    return this.transformSettings(data);
  }

  async updateSettings(settings: UpdateSettingsRequest): Promise<AdminSettings> {
    const response = await fetch(`${API_BASE_URL}/admin/settings`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(settings)
    });

    if (!response.ok) {
      throw new Error(`Failed to update settings: ${response.statusText}`);
    }

    const data = await response.json();
    return this.transformSettings(data.settings);
  }

  async updateGeneralSettings(settings: GeneralSettings): Promise<AdminSettings> {
    const response = await fetch(`${API_BASE_URL}/admin/settings/general`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(settings)
    });

    if (!response.ok) {
      throw new Error(`Failed to update general settings: ${response.statusText}`);
    }

    const data = await response.json();
    return this.transformSettings(data.settings);
  }

  async updateFeatureSettings(settings: FeatureSettings): Promise<AdminSettings> {
    const response = await fetch(`${API_BASE_URL}/admin/settings/features`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(settings)
    });

    if (!response.ok) {
      throw new Error(`Failed to update feature settings: ${response.statusText}`);
    }

    const data = await response.json();
    return this.transformSettings(data.settings);
  }

  async updateNotificationSettings(settings: NotificationSettings): Promise<AdminSettings> {
    const response = await fetch(`${API_BASE_URL}/admin/settings/notifications`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(settings)
    });

    if (!response.ok) {
      throw new Error(`Failed to update notification settings: ${response.statusText}`);
    }

    const data = await response.json();
    return this.transformSettings(data.settings);
  }

  async updateSecuritySettings(settings: SecuritySettings): Promise<AdminSettings> {
    const response = await fetch(`${API_BASE_URL}/admin/settings/security`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(settings)
    });

    if (!response.ok) {
      throw new Error(`Failed to update security settings: ${response.statusText}`);
    }

    const data = await response.json();
    return this.transformSettings(data.settings);
  }

  async resetToDefaults(): Promise<AdminSettings> {
    const response = await fetch(`${API_BASE_URL}/admin/settings/reset`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to reset settings: ${response.statusText}`);
    }

    const data = await response.json();
    return this.transformSettings(data.settings);
  }

  async isFeatureEnabled(feature: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/admin/settings/features/${feature}/enabled`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to check feature status: ${response.statusText}`);
    }

    const data = await response.json();
    return data.enabled;
  }

  async getMaintenanceMode(): Promise<{ maintenanceMode: boolean; maintenanceMessage?: string }> {
    const response = await fetch(`${API_BASE_URL}/admin/settings/maintenance-mode`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to get maintenance mode: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      maintenanceMode: data.maintenance_mode,
      maintenanceMessage: data.maintenance_message
    };
  }

  // Public settings API - no authentication required
  async getPublicSettings(): Promise<Pick<AdminSettings, 'general' | 'features'>> {
    const response = await fetch(`${API_BASE_URL}/settings/public`);

    if (!response.ok) {
      throw new Error(`Failed to fetch public settings: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      general: data.general,
      features: data.features
    };
  }

  // Legacy methods for backward compatibility
  static async getAllSettings(): Promise<AdminSettings> {
    const service = SettingsService.getInstance();
    return service.getAllSettings();
  }

  static async updateSettings(settings: UpdateSettingsRequest): Promise<AdminSettings> {
    const service = SettingsService.getInstance();
    return service.updateSettings(settings);
  }

  static async updateGeneralSettings(settings: GeneralSettings): Promise<AdminSettings> {
    const service = SettingsService.getInstance();
    return service.updateGeneralSettings(settings);
  }

  static async updateFeatureSettings(settings: FeatureSettings): Promise<AdminSettings> {
    const service = SettingsService.getInstance();
    return service.updateFeatureSettings(settings);
  }

  static async updateNotificationSettings(settings: NotificationSettings): Promise<AdminSettings> {
    const service = SettingsService.getInstance();
    return service.updateNotificationSettings(settings);
  }

  static async updateSecuritySettings(settings: SecuritySettings): Promise<AdminSettings> {
    const service = SettingsService.getInstance();
    return service.updateSecuritySettings(settings);
  }

  static async resetToDefaults(): Promise<AdminSettings> {
    const service = SettingsService.getInstance();
    return service.resetToDefaults();
  }

  static async isFeatureEnabled(feature: string): Promise<boolean> {
    const service = SettingsService.getInstance();
    return service.isFeatureEnabled(feature);
  }

  static async checkFeature(feature: keyof FeatureSettings): Promise<boolean> {
    const service = SettingsService.getInstance();
    const settings = await service.getAllSettings();
    return settings.features[feature];
  }
} 