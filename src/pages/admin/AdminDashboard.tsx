import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/dateFormatter';
import { AuditService, AuditLog, AuditAction } from '../../data/auditLogs';
import { usePosts } from '../../hooks/usePosts';
import { usePortfolio } from '../../hooks/usePortfolio';
import { useComments } from '../../hooks/useComments';

interface StatCard {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  link: string;
}

export const AdminDashboard: React.FC = () => {
  const [recentLogs, setRecentLogs] = useState<AuditLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  
  // Fetch real data from hooks
  const { posts, loading: postsLoading } = usePosts();
  const { projects, loading: portfoliosLoading } = usePortfolio();
  const { comments, loading: commentsLoading } = useComments();

  useEffect(() => {
    loadRecentActivity();
  }, []);

  const loadRecentActivity = async () => {
    setLoadingLogs(true);
    try {
      const auditService = AuditService.getInstance();
      const logs = await auditService.getRecentLogs(5); // Get 5 most recent logs
      setRecentLogs(logs);
    } catch (error) {
      console.error('Failed to load recent activity:', error);
    } finally {
      setLoadingLogs(false);
    }
  };

  // Real data from APIs
  const stats: StatCard[] = [
    {
      title: 'Total Posts',
      value: postsLoading ? '...' : posts.length,
      change: undefined, // We could calculate this from recent audit logs if needed
      trend: undefined,
      icon: <Icon icon="lucide:file-text" width={24} height={24} />,
      link: '/admin/posts'
    },
    {
      title: 'Portfolio Projects',
      value: portfoliosLoading ? '...' : projects.length,
      change: undefined,
      trend: undefined,
      icon: <Icon icon="lucide:briefcase" width={24} height={24} />,
      link: '/admin/portfolio'
    },
    {
      title: 'Comments',
      value: commentsLoading ? '...' : comments.length,
      change: undefined,
      trend: undefined,
      icon: <Icon icon="lucide:message-square" width={24} height={24} />,
      link: '/admin/comments'
    }
  ];



  const quickActions = [
    {
      title: 'New Blog Post',
      description: 'Create a new blog post',
      icon: <Icon icon="lucide:plus" width={20} height={20} />,
      link: '/admin/posts/new',
      color: 'bg-blue-500'
    },
    {
      title: 'Add Project',
      description: 'Add new portfolio project',
      icon: <Icon icon="lucide:briefcase" width={20} height={20} />,
      link: '/admin/portfolio/new',
      color: 'bg-green-500'
    }
  ];

  const getActivityIcon = (action: AuditAction) => {
    const iconMap: Record<string, { icon: string; color: string }> = {
      login: { icon: 'lucide:log-in', color: 'text-green-500' },
      logout: { icon: 'lucide:log-out', color: 'text-gray-500' },
      login_failed: { icon: 'lucide:shield-x', color: 'text-red-500' },
      post_created: { icon: 'lucide:file-plus', color: 'text-blue-500' },
      post_updated: { icon: 'lucide:file-edit', color: 'text-blue-500' },
      post_deleted: { icon: 'lucide:file-minus', color: 'text-red-500' },
      post_published: { icon: 'lucide:eye', color: 'text-green-500' },
      post_unpublished: { icon: 'lucide:eye-off', color: 'text-yellow-500' },
      portfolio_created: { icon: 'lucide:folder-plus', color: 'text-purple-500' },
      portfolio_updated: { icon: 'lucide:folder-edit', color: 'text-purple-500' },
      portfolio_deleted: { icon: 'lucide:folder-minus', color: 'text-red-500' },
      service_created: { icon: 'lucide:plus-circle', color: 'text-green-500' },
      service_updated: { icon: 'lucide:edit-3', color: 'text-blue-500' },
      service_deleted: { icon: 'lucide:minus-circle', color: 'text-red-500' },
      comment_approved: { icon: 'lucide:message-circle-check', color: 'text-green-500' },
      comment_rejected: { icon: 'lucide:message-circle-x', color: 'text-red-500' },
      comment_deleted: { icon: 'lucide:message-circle-minus', color: 'text-red-500' },
      settings_updated: { icon: 'lucide:settings', color: 'text-blue-500' },
      profile_updated: { icon: 'lucide:user-check', color: 'text-blue-500' }
    };
    
    const config = iconMap[action] || { icon: 'lucide:activity', color: 'text-gray-500' };
    return <Icon icon={config.icon} width={16} height={16} className={config.color} />;
  };

  const formatActionTitle = (log: AuditLog) => {
    const actionMap: Record<string, string> = {
      login: 'User Login',
      logout: 'User Logout',
      login_failed: 'Failed Login Attempt',
      post_created: 'Blog Post Created',
      post_updated: 'Blog Post Updated',
      post_deleted: 'Blog Post Deleted',
      post_published: 'Blog Post Published',
      post_unpublished: 'Blog Post Unpublished',
      portfolio_created: 'Portfolio Project Created',
      portfolio_updated: 'Portfolio Project Updated',
      portfolio_deleted: 'Portfolio Project Deleted',
      service_created: 'Service Created',
      service_updated: 'Service Updated',
      service_deleted: 'Service Deleted',
      comment_approved: 'Comment Approved',
      comment_rejected: 'Comment Rejected',
      comment_deleted: 'Comment Deleted',
      settings_updated: 'Settings Updated',
      profile_updated: 'Profile Updated'
    };

    const actionTitle = actionMap[log.action] || log.action.replace(/_/g, ' ');
    return log.resourceTitle ? `${actionTitle}: "${log.resourceTitle}"` : actionTitle;
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') {
      return <Icon icon="lucide:trending-up" width={16} height={16} className="text-green-500" />;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[rgb(var(--color-primary))] to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to Admin Dashboard</h1>
        <p className="text-blue-100 mb-4">
          Manage your portfolio, blog posts, and website content from this central hub.
        </p>
        <div className="flex items-center text-sm text-blue-100">
          <Icon icon="lucide:calendar" width={16} height={16} className="mr-2" />
          <span>Last login: {formatDate(new Date(), { 
            includeTime: true,
            dateStyle: 'full',
            timeStyle: 'short'
          })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-[rgb(var(--color-card))] p-6 rounded-lg border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))] transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-[rgb(var(--color-primary))] group-hover:scale-110 transition-transform duration-200">
                {stat.icon}
              </div>
              {stat.change && (
                <div className={`flex items-center text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {getTrendIcon(stat.trend)}
                  <span className="ml-1">{stat.change}</span>
                </div>
              )}
            </div>
            <h3 className="text-2xl font-bold text-[rgb(var(--color-foreground))] mb-1">
              {stat.value}
            </h3>
            <p className="text-[rgb(var(--color-muted-foreground))] text-sm">
              {stat.title}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-[rgb(var(--color-card))] p-6 rounded-lg border border-[rgb(var(--color-border))]">
            <h2 className="text-xl font-semibold text-[rgb(var(--color-foreground))] mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="flex items-center p-3 rounded-md hover:bg-[rgb(var(--color-muted))] transition-colors duration-200 group"
                >
                  <div className={`w-10 h-10 ${action.color} rounded-md flex items-center justify-center text-white mr-3 group-hover:scale-110 transition-transform duration-200`}>
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-[rgb(var(--color-foreground))] group-hover:text-[rgb(var(--color-primary))]">
                      {action.title}
                    </h3>
                    <p className="text-sm text-[rgb(var(--color-muted-foreground))]">
                      {action.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-[rgb(var(--color-card))] p-6 rounded-lg border border-[rgb(var(--color-border))]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[rgb(var(--color-foreground))]">
                Recent Activity
              </h2>
              <Link 
                to="/admin/audit-logs"
                className="text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary))]/80 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {loadingLogs ? (
                <div className="flex items-center justify-center py-8">
                  <Icon icon="lucide:loader-2" className="w-6 h-6 animate-spin text-[rgb(var(--color-muted-foreground))]" />
                  <span className="ml-2 text-[rgb(var(--color-muted-foreground))]">Loading recent activity...</span>
                </div>
              ) : recentLogs.length > 0 ? (
                recentLogs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-3 p-3 rounded-md hover:bg-[rgb(var(--color-muted))] transition-colors duration-200">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(log.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-[rgb(var(--color-foreground))] truncate">
                        {formatActionTitle(log)}
                      </h3>
                      <p className="text-sm text-[rgb(var(--color-muted-foreground))] truncate">
                        {log.userName} • {log.details || `${log.resourceType} action`}
                      </p>
                    </div>
                    <div className="flex items-center text-xs text-[rgb(var(--color-muted-foreground))]">
                      <Icon icon="lucide:clock" width={12} height={12} className="mr-1" />
                      <span>{formatDate(new Date(log.timestamp), { includeTime: true, timeStyle: 'short' })}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-[rgb(var(--color-muted-foreground))]">
                  <Icon icon="lucide:activity" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No recent activity found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-[rgb(var(--color-card))] p-6 rounded-lg border border-[rgb(var(--color-border))]">
        <h2 className="text-xl font-semibold text-[rgb(var(--color-foreground))] mb-4">
          System Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <span className="text-[rgb(var(--color-foreground))] text-sm">Website Status: Online</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <span className="text-[rgb(var(--color-foreground))] text-sm">Database: Connected</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <span className="text-[rgb(var(--color-foreground))] text-sm">Security: Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 