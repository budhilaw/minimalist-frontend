// Admin Settings types and service (for authenticated admin use)
import { TokenManager, SecureTokenManager } from '../utils/security';

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
  pageTitle: string;
  pageDescription: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
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
  smtpHost?: string;
  smtpPort?: number;
  smtpUsername?: string;
  smtpPassword?: string;
  telegramNotifications?: boolean;
  telegramBotToken?: string;
  telegramChatId?: string;
}

export interface CommentRateLimitSettings {
  enabled: boolean;
  maxCommentsPerHour: number;
  maxCommentsPerMinute: number;
  minuteWindow: number;
}

export interface SecuritySettings {
  requireStrongPasswords: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  twoFactorEnabled: boolean;
  ipWhitelist: string[];
  commentRateLimit: CommentRateLimitSettings;
  commentApprovalRequired: boolean;
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

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export class AdminSettingsService {
  private baseUrl = `${API_BASE_URL}/admin/settings`;
  private useSecureMode = true; // Toggle this to use httpOnly cookies vs localStorage

  private getAuthHeaders(): HeadersInit {
    if (this.useSecureMode) {
      // In secure mode, no need to send Authorization header
      // The httpOnly cookie will be sent automatically
      return {
        'Content-Type': 'application/json',
      };
    } else {
      // Fallback to localStorage token
      const token = TokenManager.getToken();
      return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };
    }
  }

  private getFetchOptions(options: RequestInit = {}): RequestInit {
    return {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      credentials: 'include', // Important: This sends httpOnly cookies
    };
  }

  async getAllSettings(): Promise<AdminSettings> {
    const response = await fetch(this.baseUrl, this.getFetchOptions());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async updateSettings(updates: Partial<AdminSettings>): Promise<AdminSettings> {
    const response = await fetch(this.baseUrl, this.getFetchOptions({
      method: 'PUT',
      body: JSON.stringify(updates),
    }));

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.settings || result;
  }

  async updateGeneralSettings(settings: GeneralSettings): Promise<AdminSettings> {
    const response = await fetch(`${this.baseUrl}/general`, this.getFetchOptions({
      method: 'PUT',
      body: JSON.stringify(settings),
    }));

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.settings || result;
  }

  async updateFeatureSettings(settings: FeatureSettings): Promise<AdminSettings> {
    const response = await fetch(`${this.baseUrl}/features`, this.getFetchOptions({
      method: 'PUT',
      body: JSON.stringify(settings),
    }));

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.settings || result;
  }

  async updateNotificationSettings(settings: NotificationSettings): Promise<AdminSettings> {
    const response = await fetch(`${this.baseUrl}/notifications`, this.getFetchOptions({
      method: 'PUT',
      body: JSON.stringify(settings),
    }));

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.settings || result;
  }

  async updateSecuritySettings(settings: SecuritySettings): Promise<AdminSettings> {
    const response = await fetch(`${this.baseUrl}/security`, this.getFetchOptions({
      method: 'PUT',
      body: JSON.stringify(settings),
    }));

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.settings || result;
  }

  async resetToDefaults(): Promise<AdminSettings> {
    const response = await fetch(`${this.baseUrl}/reset`, this.getFetchOptions({
      method: 'POST',
    }));

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.settings || result;
  }

  async isFeatureEnabled(feature: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/features/${feature}/enabled`, this.getFetchOptions());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.enabled;
  }

  async getMaintenanceMode(): Promise<{ maintenance_mode: boolean; maintenance_message?: string }> {
    const response = await fetch(`${this.baseUrl}/maintenance-mode`, this.getFetchOptions());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
} 