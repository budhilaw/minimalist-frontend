import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/dateFormatter';

interface StatCard {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  link: string;
}

interface RecentActivity {
  id: string;
  type: 'post' | 'comment' | 'project' | 'login';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

export const AdminDashboard: React.FC = () => {
  // Mock data - in real app, this would come from API
  const stats: StatCard[] = [
    {
      title: 'Total Posts',
      value: 12,
      change: '+2',
      trend: 'up',
      icon: <Icon icon="lucide:file-text" width={24} height={24} />,
      link: '/admin/posts'
    },
    {
      title: 'Portfolio Projects',
      value: 6,
      change: '+1',
      trend: 'up',
      icon: <Icon icon="lucide:briefcase" width={24} height={24} />,
      link: '/admin/portfolio'
    },
    {
      title: 'Comments',
      value: 48,
      change: '+8',
      trend: 'up',
      icon: <Icon icon="lucide:message-square" width={24} height={24} />,
      link: '/admin/comments'
    },

    {
      title: 'Page Views',
      value: '2.4K',
      change: '+12%',
      trend: 'up',
      icon: <Icon icon="lucide:eye" width={24} height={24} />,
      link: '#'
    }
  ];

  const recentActivity: RecentActivity[] = [
    {
      id: '1',
      type: 'comment',
      title: 'New comment on "Building Microservices"',
      description: 'Sarah Johnson left a comment',
      timestamp: '2 hours ago',
      user: 'Sarah Johnson'
    },
    {
      id: '2',
      type: 'post',
      title: 'Blog post updated',
      description: '"React Best Practices" was updated',
      timestamp: '5 hours ago'
    },
    {
      id: '3',
      type: 'project',
      title: 'New portfolio project added',
      description: '"E-commerce Platform" project created',
      timestamp: '1 day ago'
    },
    {
      id: '4',
      type: 'login',
      title: 'Admin login',
      description: 'Successful login from new device',
      timestamp: '2 days ago'
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
    },

    {
      title: 'View Analytics',
      description: 'Check website analytics',
      icon: <Icon icon="lucide:bar-chart3" width={20} height={20} />,
      link: '#',
      color: 'bg-orange-500'
    }
  ];

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'post':
        return <Icon icon="lucide:file-text" width={16} height={16} className="text-blue-500" />;
      case 'comment':
        return <Icon icon="lucide:message-square" width={16} height={16} className="text-green-500" />;
      case 'project':
        return <Icon icon="lucide:briefcase" width={16} height={16} className="text-purple-500" />;
      case 'login':
        return <Icon icon="lucide:activity" width={16} height={16} className="text-orange-500" />;
      default:
        return <Icon icon="lucide:activity" width={16} height={16} className="text-gray-500" />;
    }
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <button className="text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary))]/80 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-md hover:bg-[rgb(var(--color-muted))] transition-colors duration-200">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-[rgb(var(--color-foreground))] truncate">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-[rgb(var(--color-muted-foreground))] truncate">
                      {activity.description}
                    </p>
                  </div>
                  <div className="flex items-center text-xs text-[rgb(var(--color-muted-foreground))]">
                    <Icon icon="lucide:clock" width={12} height={12} className="mr-1" />
                    <span>{activity.timestamp}</span>
                  </div>
                </div>
              ))}
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