import React, { useEffect } from 'react';
import { Icon } from '@iconify/react';

interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  description?: string;
  onClose?: () => void;
  autoHide?: boolean;
  duration?: number;
}

export const Notification: React.FC<NotificationProps> = ({
  type,
  title,
  message,
  description,
  onClose,
  autoHide = true,
  duration = 5000
}) => {
  useEffect(() => {
    if (autoHide && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoHide, onClose, duration]);

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
          icon: 'text-green-600 dark:text-green-400',
          title: 'text-green-800 dark:text-green-200',
          message: 'text-green-700 dark:text-green-300',
          description: 'text-green-600 dark:text-green-400',
          iconName: 'lucide:check-circle'
        };
      case 'error':
        return {
          container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
          icon: 'text-red-600 dark:text-red-400',
          title: 'text-red-800 dark:text-red-200',
          message: 'text-red-700 dark:text-red-300',
          description: 'text-red-600 dark:text-red-400',
          iconName: 'lucide:alert-circle'
        };
      case 'warning':
        return {
          container: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
          icon: 'text-orange-600 dark:text-orange-400',
          title: 'text-orange-800 dark:text-orange-200',
          message: 'text-orange-700 dark:text-orange-300',
          description: 'text-orange-600 dark:text-orange-400',
          iconName: 'lucide:alert-triangle'
        };
      case 'info':
        return {
          container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
          icon: 'text-blue-600 dark:text-blue-400',
          title: 'text-blue-800 dark:text-blue-200',
          message: 'text-blue-700 dark:text-blue-300',
          description: 'text-blue-600 dark:text-blue-400',
          iconName: 'lucide:info'
        };
      default:
        return {
          container: 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800',
          icon: 'text-gray-600 dark:text-gray-400',
          title: 'text-gray-800 dark:text-gray-200',
          message: 'text-gray-700 dark:text-gray-300',
          description: 'text-gray-600 dark:text-gray-400',
          iconName: 'lucide:info'
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`p-4 border rounded-lg ${styles.container}`}>
      <div className="flex items-start">
        <Icon 
          icon={styles.iconName}
          width={20} 
          height={20} 
          className={`${styles.icon} mr-3 mt-0.5 flex-shrink-0`}
        />
        <div className="flex-1">
          <p className={`text-sm font-medium ${styles.title} mb-1`}>
            {title}
          </p>
          <p className={`text-sm ${styles.message}`}>
            {message}
          </p>
          {description && (
            <p className={`text-xs ${styles.description} mt-2`}>
              {description}
            </p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`ml-3 ${styles.icon} hover:opacity-70 transition-opacity`}
          >
            <Icon icon="lucide:x" width={16} height={16} />
          </button>
        )}
      </div>
    </div>
  );
};

// Hook for managing notifications
export const useNotification = () => {
  const [notification, setNotification] = React.useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    description?: string;
  } | null>(null);

  const showNotification = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string,
    description?: string
  ) => {
    setNotification({ type, title, message, description });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return {
    notification,
    showNotification,
    hideNotification
  };
}; 