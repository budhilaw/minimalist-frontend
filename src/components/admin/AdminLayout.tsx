import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Settings, 
  User, 
  MessageSquare,
  LogOut,
  Menu,
  X,
  Shield,
  Bell,
  Activity,
  CheckCircle,
  AlertCircle,
  Info,
  Trash2
} from 'lucide-react';
import { AuditLogger } from '../../utils/security';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
}

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Comment',
      message: 'Sarah Johnson commented on "React Best Practices"',
      type: 'info',
      timestamp: '2 hours ago',
      read: false,
      action: {
        label: 'View Comment',
        url: '/admin/comments'
      }
    },
    {
      id: '2',
      title: 'Blog Post Published',
      message: 'Your post "Building Microservices" is now live',
      type: 'success',
      timestamp: '5 hours ago',
      read: false,
      action: {
        label: 'View Post',
        url: '/blog/building-microservices'
      }
    },
    {
      id: '3',
      title: 'Portfolio Updated',
      message: 'E-commerce Platform project has been updated',
      type: 'info',
      timestamp: '1 day ago',
      read: true
    },
    {
      id: '4',
      title: 'Security Alert',
      message: 'New login from Chrome on macOS',
      type: 'warning',
      timestamp: '2 days ago',
      read: true
    }
  ]);

  const navItems: NavItem[] = [
    {
      path: '/admin',
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />
    },
    {
      path: '/admin/posts',
      label: 'Blog Posts',
      icon: <FileText size={20} />,
      count: 12 // This would come from API
    },
    {
      path: '/admin/portfolio',
      label: 'Portfolio',
      icon: <Briefcase size={20} />,
      count: 6
    },
    {
      path: '/admin/services',
      label: 'Services',
      icon: <Settings size={20} />,
      count: 4
    },

    {
      path: '/admin/comments',
      label: 'Comments',
      icon: <MessageSquare size={20} />,
      count: 8
    },
    {
      path: '/admin/profile',
      label: 'Profile',
      icon: <User size={20} />
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    );
    
    // Navigate if action exists
    if (notification.action) {
      if (notification.action.url.startsWith('/')) {
        navigate(notification.action.url);
      } else {
        window.open(notification.action.url, '_blank');
      }
    }
    
    setNotificationsOpen(false);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'warning':
        return <AlertCircle size={16} className="text-orange-500" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return <Info size={16} className="text-blue-500" />;
    }
  };

  const handleLogout = () => {
    AuditLogger.log('ADMIN_LOGOUT', { userId: user?.id });
    logout();
    navigate('/admin/login');
  };

  const isActiveRoute = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[rgb(var(--color-card))] border-r border-[rgb(var(--color-border))] transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-[rgb(var(--color-border))]">
          <div className="flex items-center">
            <Shield className="text-[rgb(var(--color-primary))] mr-3" size={24} />
            <h1 className="text-xl font-bold text-[rgb(var(--color-foreground))]">
              Admin Panel
            </h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-foreground))]"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-[rgb(var(--color-border))]">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-[rgb(var(--color-primary))] rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {user?.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-[rgb(var(--color-foreground))]">
                {user?.username}
              </p>
              <p className="text-xs text-[rgb(var(--color-muted-foreground))] capitalize">
                {user?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActiveRoute(item.path)
                      ? 'bg-[rgb(var(--color-primary))] text-white'
                      : 'text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-muted))]'
                  }`}
                >
                  <div className="flex items-center">
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </div>
                  {item.count && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      isActiveRoute(item.path)
                        ? 'bg-white/80 text-white'
                        : 'bg-[rgb(var(--color-muted))] text-[rgb(var(--color-muted-foreground))]'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[rgb(var(--color-border))]">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 rounded-md transition-colors duration-200"
          >
            <LogOut size={20} />
            <span className="ml-3">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-[rgb(var(--color-background))] border-b border-[rgb(var(--color-border))] px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-foreground))]"
            >
              <Menu size={24} />
            </button>

            {/* Page Title */}
            <div className="hidden lg:block">
              <h1 className="text-2xl font-semibold text-[rgb(var(--color-foreground))]">
                {navItems.find(item => isActiveRoute(item.path))?.label || 'Admin Panel'}
              </h1>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Activity Indicator */}
              <div className="flex items-center text-sm text-[rgb(var(--color-muted-foreground))]">
                <Activity size={16} className="mr-2 text-green-500" />
                <span>Online</span>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-muted))] rounded-md transition-colors"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-30" 
                      onClick={() => setNotificationsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-[rgb(var(--color-border))] rounded-lg shadow-2xl z-40 max-h-96 overflow-hidden">
                                              {/* Header */}
                        <div className="px-4 py-3 border-b border-[rgb(var(--color-border))] flex items-center justify-between bg-white dark:bg-gray-900">
                        <h3 className="text-sm font-medium text-[rgb(var(--color-foreground))]">
                          Notifications
                        </h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary))]/80"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>

                      {/* Notifications List */}
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-[rgb(var(--color-muted-foreground))] text-sm">
                            No notifications
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-4 border-b border-[rgb(var(--color-border))] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group ${
                                !notification.read ? 'bg-blue-50 dark:bg-blue-900' : 'bg-white dark:bg-gray-900'
                              }`}
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 mt-0.5">
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between">
                                    <p className={`text-sm font-medium ${
                                      !notification.read 
                                        ? 'text-[rgb(var(--color-foreground))]' 
                                        : 'text-[rgb(var(--color-muted-foreground))]'
                                    }`}>
                                      {notification.title}
                                    </p>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteNotification(notification.id);
                                      }}
                                      className="opacity-0 group-hover:opacity-100 text-[rgb(var(--color-muted-foreground))] hover:text-red-500 transition-all ml-2"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                  <p className="text-xs text-[rgb(var(--color-muted-foreground))] mt-1">
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-[rgb(var(--color-muted-foreground))]">
                                      {notification.timestamp}
                                    </span>
                                    {notification.action && (
                                      <span className="text-xs text-[rgb(var(--color-primary))] font-medium">
                                        {notification.action.label}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                                              {/* Footer */}
                        {notifications.length > 0 && (
                          <div className="px-4 py-3 border-t border-[rgb(var(--color-border))] text-center bg-white dark:bg-gray-900">
                          <button className="text-sm text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary))]/80 font-medium">
                            View All Notifications
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <Link
                  to="/admin/profile"
                  className="hidden lg:flex items-center text-sm text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-foreground))] transition-colors"
                >
                  <span>Welcome back, </span>
                  <span className="ml-1 font-medium text-[rgb(var(--color-foreground))]">
                    {user?.username}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}; 