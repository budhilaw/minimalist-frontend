import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuditLog, AuditService } from '../data/auditLogs';
import { UserNotificationService, UserNotification } from '../data/userNotifications';
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
  const { isAuthenticated, loading } = useAuth();
  const userNotificationService = new UserNotificationService();

  // Only load notifications when user is authenticated and not loading
  useEffect(() => {
    if (loading) {
      // Still loading authentication state, don't do anything yet
      return;
    }
    
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }

    // Load notifications from backend with read status
    const loadInitialNotifications = async () => {
      try {
        const response = await userNotificationService.getUserNotifications(20, 0);
        
        const initialNotifications: AppNotification[] = response.notifications.map(notification => 
          UserNotificationService.convertToAppNotification(notification)
        );

        setNotifications(initialNotifications);
      } catch (error) {
        console.error('Failed to load initial notifications:', error);
        // Don't fallback to audit logs as they require admin authentication
        // Just set empty notifications array
        setNotifications([]);
      }
    };

    loadInitialNotifications();
  }, [isAuthenticated, loading]);

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
          // No actionUrl - remove "View Details" link for settings updates
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

  const markAsRead = async (id: string) => {
    // Update local state immediately for better UX
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );

    // Persist to backend
    try {
      const auditLogId = id.replace('notif_', ''); // Extract audit log ID
      await userNotificationService.markNotificationRead(auditLogId);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Revert local state on error
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, read: false } : notification
        )
      );
    }
  };

  const markAllAsRead = async () => {
    // Update local state immediately for better UX
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );

    // Persist to backend
    try {
      await userNotificationService.markAllNotificationsRead();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      // Revert local state on error
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: false }))
      );
    }
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
  const { user } = useAuth(); // Get current user from auth context

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
        userId: user?.id || '', // Use actual user ID or empty string as fallback
        userName: user?.username || user?.full_name || 'Unknown User', // Use actual username
        action: actionData.action as any,
        resourceType: actionData.resourceType as any,
        resourceId: actionData.resourceId,
        resourceTitle: actionData.resourceTitle,
        details: actionData.details,
        success: actionData.success,
        ipAddress: undefined, // Let backend handle IP detection
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