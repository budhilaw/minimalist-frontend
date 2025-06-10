const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: AuditAction;
  resourceType: ResourceType;
  resourceId?: string;
  resourceTitle?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
}

export type AuditAction = 
  // Authentication
  | 'login' | 'logout' | 'login_failed'
  // Posts
  | 'post_created' | 'post_updated' | 'post_deleted' | 'post_published' | 'post_unpublished'
  // Portfolio
  | 'portfolio_created' | 'portfolio_updated' | 'portfolio_deleted' | 'portfolio_featured' | 'portfolio_unfeatured'
  // Services
  | 'service_created' | 'service_updated' | 'service_deleted' | 'service_activated' | 'service_deactivated'
  // Comments
  | 'comment_approved' | 'comment_rejected' | 'comment_deleted'
  // Settings
  | 'settings_updated'
  // Profile
  | 'profile_updated';

export type ResourceType = 
  | 'authentication' 
  | 'post' 
  | 'portfolio' 
  | 'service' 
  | 'comment' 
  | 'settings' 
  | 'profile';

export interface AuditLogFilters {
  startDate?: string;
  endDate?: string;
  action?: AuditAction;
  resourceType?: ResourceType;
  success?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AuditLogResponse {
  logs: AuditLog[];
  totalCount: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export class AuditService {
  private static instance: AuditService;

  static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService();
    }
    return AuditService.instance;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private transformAuditLog(apiLog: any): AuditLog {
    return {
      id: apiLog.id,
      timestamp: apiLog.created_at,
      userId: apiLog.user_id || '',
      userName: apiLog.user_name || 'Unknown User',
      action: apiLog.action,
      resourceType: apiLog.resource_type,
      resourceId: apiLog.resource_id,
      resourceTitle: apiLog.resource_title,
      details: apiLog.details,
      ipAddress: apiLog.ip_address,
      userAgent: apiLog.user_agent,
      success: apiLog.success,
      errorMessage: apiLog.error_message
    };
  }

  async getAllLogs(filters: AuditLogFilters = {}): Promise<AuditLogResponse> {
    const params = new URLSearchParams();
    
    if (filters.startDate) {
      params.append('start_date', filters.startDate);
    }
    if (filters.endDate) {
      params.append('end_date', filters.endDate);
    }
    if (filters.action) {
      params.append('action', filters.action);
    }
    if (filters.resourceType) {
      params.append('resource_type', filters.resourceType);
    }
    if (filters.success !== undefined) {
      params.append('success', filters.success.toString());
    }
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.page) {
      params.append('offset', ((filters.page - 1) * (filters.limit || 20)).toString());
    }
    if (filters.limit) {
      params.append('limit', filters.limit.toString());
    }

    const response = await fetch(`${API_BASE_URL}/admin/audit-logs?${params}`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch audit logs: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      logs: data.logs.map((log: any) => this.transformAuditLog(log)),
      totalCount: data.total_count,
      page: data.page,
      perPage: data.per_page,
      totalPages: data.total_pages
    };
  }

  async getLogById(id: string): Promise<AuditLog | null> {
    const response = await fetch(`${API_BASE_URL}/admin/audit-logs/${id}`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch audit log: ${response.statusText}`);
    }

    const data = await response.json();
    return this.transformAuditLog(data);
  }

  async createLog(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    const response = await fetch(`${API_BASE_URL}/admin/audit-logs`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        user_id: log.userId || null,
        user_name: log.userName,
        action: log.action,
        resource_type: log.resourceType,
        resource_id: log.resourceId || null,
        resource_title: log.resourceTitle || null,
        details: log.details || null,
        ip_address: log.ipAddress || null,
        user_agent: log.userAgent || null,
        success: log.success,
        error_message: log.errorMessage || null
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to create audit log: ${response.statusText}`);
    }

    const data = await response.json();
    return this.transformAuditLog(data.audit_log);
  }

  async getRecentLogs(limit: number = 10): Promise<AuditLog[]> {
    const response = await fetch(`${API_BASE_URL}/admin/audit-logs/recent?limit=${limit}`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch recent audit logs: ${response.statusText}`);
    }

    const data = await response.json();
    return data.logs.map((log: any) => this.transformAuditLog(log));
  }

  async getFailedActions(limit: number = 20): Promise<AuditLog[]> {
    const response = await fetch(`${API_BASE_URL}/admin/audit-logs/failed?limit=${limit}`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch failed audit logs: ${response.statusText}`);
    }

    const data = await response.json();
    return data.logs.map((log: any) => this.transformAuditLog(log));
  }

  async getStats(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/admin/audit-logs/stats`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch audit log stats: ${response.statusText}`);
    }

    return response.json();
  }

  // Legacy methods for backward compatibility
  static async getAllLogs(): Promise<AuditLog[]> {
    const service = AuditService.getInstance();
    const response = await service.getAllLogs();
    return response.logs;
  }

  static async getLogsByDateRange(startDate: string, endDate: string): Promise<AuditLog[]> {
    const service = AuditService.getInstance();
    const response = await service.getAllLogs({ startDate, endDate });
    return response.logs;
  }

  static async getLogsByAction(action: AuditAction): Promise<AuditLog[]> {
    const service = AuditService.getInstance();
    const response = await service.getAllLogs({ action });
    return response.logs;
  }

  static async getLogsByResourceType(resourceType: ResourceType): Promise<AuditLog[]> {
    const service = AuditService.getInstance();
    const response = await service.getAllLogs({ resourceType });
    return response.logs;
  }

  static async createLog(logData: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    const service = AuditService.getInstance();
    return service.createLog(logData);
  }

  static getActionDisplayName(action: AuditAction): string {
    const actionMap: Record<AuditAction, string> = {
      'login': 'User Login',
      'logout': 'User Logout',
      'login_failed': 'Failed Login',
      'post_created': 'Post Created',
      'post_updated': 'Post Updated',
      'post_deleted': 'Post Deleted',
      'post_published': 'Post Published',
      'post_unpublished': 'Post Unpublished',
      'portfolio_created': 'Portfolio Created',
      'portfolio_updated': 'Portfolio Updated',
      'portfolio_deleted': 'Portfolio Deleted',
      'portfolio_featured': 'Portfolio Featured',
      'portfolio_unfeatured': 'Portfolio Unfeatured',
      'service_created': 'Service Created',
      'service_updated': 'Service Updated',
      'service_deleted': 'Service Deleted',
      'service_activated': 'Service Activated',
      'service_deactivated': 'Service Deactivated',
      'comment_approved': 'Comment Approved',
      'comment_rejected': 'Comment Rejected',
      'comment_deleted': 'Comment Deleted',
      'settings_updated': 'Settings Updated',
      'profile_updated': 'Profile Updated'
    };
    return actionMap[action] || action;
  }

  static getResourceTypeDisplayName(resourceType: ResourceType): string {
    const resourceMap: Record<ResourceType, string> = {
      'authentication': 'Authentication',
      'post': 'Blog Post',
      'portfolio': 'Portfolio',
      'service': 'Service',
      'comment': 'Comment',
      'settings': 'Settings',
      'profile': 'Profile'
    };
    return resourceMap[resourceType] || resourceType;
  }

  static getActionsByCategory(): Record<string, AuditAction[]> {
    return {
      'Authentication': ['login', 'logout', 'login_failed'],
      'Content Management': [
        'post_created', 'post_updated', 'post_deleted', 'post_published', 'post_unpublished',
        'portfolio_created', 'portfolio_updated', 'portfolio_deleted', 'portfolio_featured', 'portfolio_unfeatured',
        'service_created', 'service_updated', 'service_deleted', 'service_activated', 'service_deactivated'
      ],
      'Moderation': ['comment_approved', 'comment_rejected', 'comment_deleted'],
      'Administration': ['settings_updated', 'profile_updated']
    };
  }
} 