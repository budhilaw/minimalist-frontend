import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuditLog, AuditService } from '../data/auditLogs';
import { useAuth } from '../hooks/useAuth';

export interface AppNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  relatedAuditLog?: string;
  autoHide?: boolean;
  persistent?: boolean;
}

interface NotificationContextType {
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const { isAuthenticated } = useAuth();

  // Only load notifications when user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }

    // Load recent audit logs and create notifications
    const loadInitialNotifications = async () => {
      try {
        const auditLogs = await AuditService.getAllLogs();
        const recentLogs = auditLogs.slice(0, 5); // Get 5 most recent logs
        
        const initialNotifications: AppNotification[] = recentLogs.map(log => 
          createNotificationFromAuditLog(log)
        );

        setNotifications(initialNotifications);
      } catch (error) {
        console.error('Failed to load initial notifications:', error);
      }
    };

    loadInitialNotifications();
  }, [isAuthenticated]);

  // Helper function to create notification from audit log
  const createNotificationFromAuditLog = (auditLog: AuditLog): AppNotification => {
    const { action, resourceType, resourceTitle, success, timestamp, userName } = auditLog;
    
    let type: AppNotification['type'] = 'info';
    let title = '';
    let message = '';
    let actionUrl = '';
    
    // Determine notification type and content based on audit log
    if (!success) {
      type = 'error';
      title = 'Action Failed';
      message = `${AuditService.getActionDisplayName(action)} failed for ${AuditService.getResourceTypeDisplayName(resourceType)}`;
    } else {
      switch (action) {
        case 'login':
          type = 'info';
          title = 'User Login';
          message = `${userName} logged into the admin panel`;
          break;
        case 'post_created':
          type = 'success';
          title = 'New Post Created';
          message = `"${resourceTitle}" has been created`;
          actionUrl = `/admin/posts`;
          break;
        case 'post_published':
          type = 'success';
          title = 'Post Published';
          message = `"${resourceTitle}" is now live`;
          actionUrl = `/blog/${auditLog.resourceId}`;
          break;
        case 'portfolio_created':
          type = 'success';
          title = 'Portfolio Project Added';
          message = `"${resourceTitle}" has been added to portfolio`;
          actionUrl = `/admin/portfolio`;
          break;
        case 'service_activated':
          type = 'success';
          title = 'Service Activated';
          message = `"${resourceTitle}" is now available`;
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
          actionUrl = `/admin/settings`;
          break;
        default:
          title = AuditService.getActionDisplayName(action);
          message = `${AuditService.getResourceTypeDisplayName(resourceType)} has been ${action.split('_')[1] || 'modified'}`;
      }
    }

    return {
      id: `notif_${auditLog.id}`,
      type,
      title,
      message,
      timestamp,
      read: false,
      actionUrl,
      actionLabel: actionUrl ? 'View Details' : undefined,
      relatedAuditLog: auditLog.id,
      autoHide: type === 'success',
      persistent: type === 'error'
    };
  };

  const addNotification = (notificationData: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: AppNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
      ...notificationData
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-hide success notifications after 5 seconds
    if (newNotification.autoHide) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    unreadCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Helper hook to create notifications from admin actions
export const useAdminActions = () => {
  const { addNotification } = useNotifications();

  const logAdminAction = async (actionData: {
    action: string;
    resourceType: string;
    resourceId?: string;
    resourceTitle?: string;
    success: boolean;
    details?: string;
  }) => {
    try {
      // Create audit log
      const auditLog = await AuditService.createLog({
        userId: 'admin_001', // In real app, get from auth context
        userName: 'John Doe', // In real app, get from auth context
        action: actionData.action as any,
        resourceType: actionData.resourceType as any,
        resourceId: actionData.resourceId,
        resourceTitle: actionData.resourceTitle,
        details: actionData.details,
        success: actionData.success,
        ipAddress: '192.168.1.100', // In real app, get from request
        userAgent: navigator.userAgent
      });

      // Create notification based on action type
      let type: AppNotification['type'] = actionData.success ? 'success' : 'error';
      let title = actionData.success ? 'Action Completed' : 'Action Failed';
      let message = `${actionData.action.replace('_', ' ')} ${actionData.success ? 'completed successfully' : 'failed'}`;

      if (actionData.resourceTitle) {
        message += ` for "${actionData.resourceTitle}"`;
      }

      addNotification({
        type,
        title,
        message,
        relatedAuditLog: auditLog.id,
        autoHide: actionData.success,
        persistent: !actionData.success
      });

    } catch (error) {
      console.error('Failed to log admin action:', error);
      addNotification({
        type: 'error',
        title: 'Logging Error',
        message: 'Failed to record admin action in audit log',
        persistent: true
      });
    }
  };

  return { logAdminAction };
}; 