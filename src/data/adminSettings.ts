// Admin Settings types and service (for authenticated admin use)
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

export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  photo_profile?: string;
  social_media_links: SocialMediaLinks;
  files: FilesSettings;
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

export class AdminSettingsService {
  private baseUrl = '/api/v1/admin/settings';

  async getAllSettings(): Promise<AdminSettings> {
    const response = await fetch(this.baseUrl, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async updateSettings(updates: Partial<AdminSettings>): Promise<AdminSettings> {
    const response = await fetch(this.baseUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.settings || result;
  }

  async updateGeneralSettings(settings: GeneralSettings): Promise<AdminSettings> {
    const response = await fetch(`${this.baseUrl}/general`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.settings || result;
  }

  async updateFeatureSettings(settings: FeatureSettings): Promise<AdminSettings> {
    const response = await fetch(`${this.baseUrl}/features`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.settings || result;
  }

  async updateNotificationSettings(settings: NotificationSettings): Promise<AdminSettings> {
    const response = await fetch(`${this.baseUrl}/notifications`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.settings || result;
  }

  async updateSecuritySettings(settings: SecuritySettings): Promise<AdminSettings> {
    const response = await fetch(`${this.baseUrl}/security`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.settings || result;
  }

  async resetToDefaults(): Promise<AdminSettings> {
    const response = await fetch(`${this.baseUrl}/reset`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.settings || result;
  }

  async isFeatureEnabled(feature: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/features/${feature}/enabled`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.enabled;
  }

  async getMaintenanceMode(): Promise<{ maintenance_mode: boolean; maintenance_message?: string }> {
    const response = await fetch(`${this.baseUrl}/maintenance-mode`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
} 