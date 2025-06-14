import { SecureTokenManager } from '../utils/security';

export interface UserNotification {
  id: string;
  user_id?: string;
  user_name?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  resource_title?: string;
  details?: string;
  success: boolean;
  error_message?: string;
  created_at: string;
  read: boolean;
  read_at?: string;
}

export interface NotificationStats {
  total_notifications: number;
  unread_notifications: number;
  read_notifications: number;
  notifications_today: number;
  last_read_at?: string;
}

export interface UserNotificationPreference {
  id: string;
  user_id: string;
  notification_type: string;
  enabled: boolean;
  delivery_method: string; // 'in_app', 'email', 'both'
  created_at: string;
  updated_at: string;
}

export interface UserNotificationsResponse {
  notifications: UserNotification[];
  stats: NotificationStats;
  preferences: UserNotificationPreference[];
}

export interface MarkNotificationReadRequest {
  audit_log_id: string;
}

export interface MarkNotificationsReadRequest {
  audit_log_ids: string[];
}

export interface UpdateNotificationPreferenceRequest {
  notification_type: string;
  enabled: boolean;
  delivery_method?: string;
}

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export class UserNotificationService {
  private baseUrl = `${API_BASE_URL}/user/notifications`;

  private getFetchOptions(options: RequestInit = {}): RequestInit {
    return {
      ...options,
      credentials: 'include', // Include httpOnly cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }

  async getUserNotifications(
    limit?: number,
    offset?: number,
    unreadOnly?: boolean
  ): Promise<UserNotificationsResponse> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    if (unreadOnly) params.append('unread_only', 'true');

    const response = await fetch(
      `${this.baseUrl}?${params.toString()}`,
      this.getFetchOptions()
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async markNotificationRead(auditLogId: string): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/mark-read`,
      this.getFetchOptions({
        method: 'POST',
        body: JSON.stringify({ audit_log_id: auditLogId }),
      })
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  async markNotificationsRead(auditLogIds: string[]): Promise<number> {
    const response = await fetch(
      `${this.baseUrl}/mark-multiple-read`,
      this.getFetchOptions({
        method: 'POST',
        body: JSON.stringify({ audit_log_ids: auditLogIds }),
      })
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.count;
  }

  async markAllNotificationsRead(): Promise<number> {
    const response = await fetch(
      `${this.baseUrl}/mark-all-read`,
      this.getFetchOptions({
        method: 'POST',
      })
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.count;
  }

  async getNotificationStats(): Promise<NotificationStats> {
    const response = await fetch(
      `${this.baseUrl}/stats`,
      this.getFetchOptions()
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getUnreadCount(): Promise<number> {
    const response = await fetch(
      `${this.baseUrl}/unread-count`,
      this.getFetchOptions()
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.unread_count;
  }

  async getNotificationPreferences(): Promise<UserNotificationPreference[]> {
    const response = await fetch(
      `${this.baseUrl}/preferences`,
      this.getFetchOptions()
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.preferences;
  }

  async updateNotificationPreference(
    request: UpdateNotificationPreferenceRequest
  ): Promise<UserNotificationPreference> {
    const response = await fetch(
      `${this.baseUrl}/preferences`,
      this.getFetchOptions({
        method: 'PUT',
        body: JSON.stringify(request),
      })
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.preference;
  }

  // Helper method to convert backend notification to frontend format
  static convertToAppNotification(notification: UserNotification): any {
    const { action, resource_type, resource_title, success, created_at } = notification;
    
    let type: 'info' | 'success' | 'warning' | 'error' = 'info';
    let title = '';
    let message = '';
    let actionUrl = '';
    
    // Determine notification type and content based on audit log
    if (!success) {
      type = 'error';
      title = 'Action Failed';
      message = `${UserNotificationService.getActionDisplayName(action)} failed for ${UserNotificationService.getResourceTypeDisplayName(resource_type)}`;
    } else {
      switch (action) {
        case 'login':
          type = 'info';
          title = 'User Login';
          message = `${notification.user_name} logged into the admin panel`;
          break;
        case 'post_created':
          type = 'success';
          title = 'New Post Created';
          message = `"${resource_title}" has been created`;
          actionUrl = `/admin/posts`;
          break;
        case 'post_published':
          type = 'success';
          title = 'Post Published';
          message = `"${resource_title}" is now live`;
          actionUrl = `/blog/${notification.resource_id}`;
          break;
        case 'portfolio_created':
          type = 'success';
          title = 'Portfolio Project Added';
          message = `"${resource_title}" has been added to portfolio`;
          actionUrl = `/admin/portfolio`;
          break;
        case 'service_activated':
          type = 'success';
          title = 'Service Activated';
          message = `"${resource_title}" is now available`;
          actionUrl = `/admin/services`;
          break;
        case 'comment_approved':
          type = 'info';
          title = 'Comment Approved';
          message = `A comment has been approved`;
          actionUrl = `/admin/comments`;
          break;
        case 'settings_updated':
          type = 'info';
          title = 'Settings Updated';
          message = `System settings have been modified`;
          break;
        default:
          title = UserNotificationService.getActionDisplayName(action);
          message = `${UserNotificationService.getResourceTypeDisplayName(resource_type)} has been ${action.split('_')[1] || 'modified'}`;
      }
    }

    return {
      id: `notif_${notification.id}`,
      type,
      title,
      message,
      timestamp: created_at,
      read: notification.read,
      actionUrl,
      actionLabel: actionUrl ? 'View Details' : undefined,
      relatedAuditLog: notification.id,
      autoHide: type === 'success',
      persistent: type === 'error'
    };
  }

  static getActionDisplayName(action: string): string {
    const actionMap: Record<string, string> = {
      'login': 'Login',
      'logout': 'Logout',
      'post_created': 'Post Created',
      'post_updated': 'Post Updated',
      'post_published': 'Post Published',
      'portfolio_created': 'Portfolio Created',
      'portfolio_updated': 'Portfolio Updated',
      'service_created': 'Service Created',
      'service_updated': 'Service Updated',
      'comment_approved': 'Comment Approved',
      'comment_rejected': 'Comment Rejected',
      'settings_updated': 'Settings Updated',
      'profile_updated': 'Profile Updated',
    };

    return actionMap[action] || action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  static getResourceTypeDisplayName(resourceType: string): string {
    const typeMap: Record<string, string> = {
      'post': 'Post',
      'portfolio': 'Portfolio Project',
      'service': 'Service',
      'comment': 'Comment',
      'user': 'User',
      'settings': 'Settings',
    };

    return typeMap[resourceType] || resourceType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
} 