import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useAdminComments } from '../../hooks/useAdminComments';
import { LoadingSpinner, ErrorMessage } from '../../components/LoadingSpinner';
import { formatRelativeTime } from '../../utils/dateFormatter';

interface CommentFilters {
  status: 'all' | 'pending' | 'approved' | 'rejected';
  search: string;
  postId?: string;
}

export const AdminComments: React.FC = () => {
  const [filters, setFilters] = useState<CommentFilters>({
    status: 'all',
    search: '',
  });
  const [selectedComments, setSelectedComments] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const {
    comments,
    stats,
    loading,
    error,
    approveComment,
    rejectComment,
    deleteComment,
    bulkUpdateStatus,
    refreshComments,
  } = useAdminComments(filters);

  useEffect(() => {
    setShowBulkActions(selectedComments.length > 0);
  }, [selectedComments]);

  const handleSelectComment = (commentId: string) => {
    setSelectedComments(prev => 
      prev.includes(commentId)
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedComments.length === comments.length) {
      setSelectedComments([]);
    } else {
      setSelectedComments(comments.map(comment => comment.id));
    }
  };

  const handleBulkAction = async (action: 'approve' | 'reject' | 'delete') => {
    if (selectedComments.length === 0) return;

    try {
      if (action === 'delete') {
        await Promise.all(selectedComments.map(id => deleteComment(id)));
      } else {
        await bulkUpdateStatus(selectedComments, action === 'approve' ? 'approved' : 'rejected');
      }
      setSelectedComments([]);
      refreshComments();
    } catch (error) {
      console.error(`Failed to ${action} comments:`, error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: 'lucide:clock' },
      approved: { color: 'bg-green-100 text-green-800', icon: 'lucide:check-circle' },
      rejected: { color: 'bg-red-100 text-red-800', icon: 'lucide:x-circle' },
      spam: { color: 'bg-gray-100 text-gray-800', icon: 'lucide:shield-x' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon icon={config.icon} width={12} height={12} className="mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[rgb(var(--color-foreground))]">
            Comments Management
          </h1>
          <p className="text-[rgb(var(--color-muted-foreground))] mt-1">
            Moderate and manage blog post comments
          </p>
        </div>
        <button
          onClick={refreshComments}
          className="flex items-center px-4 py-2 border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] rounded-md hover:bg-[rgb(var(--color-muted))] transition-colors"
        >
          <Icon icon="lucide:refresh-cw" width={16} height={16} className="mr-2" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[rgb(var(--color-card))] p-4 rounded-lg border border-[rgb(var(--color-border))]">
          <div className="flex items-center">
            <Icon icon="lucide:message-square" width={20} height={20} className="text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-[rgb(var(--color-muted-foreground))]">Total Comments</p>
              <p className="text-2xl font-bold text-[rgb(var(--color-foreground))]">{stats?.total_comments || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-[rgb(var(--color-card))] p-4 rounded-lg border border-[rgb(var(--color-border))]">
          <div className="flex items-center">
            <Icon icon="lucide:clock" width={20} height={20} className="text-yellow-500 mr-3" />
            <div>
              <p className="text-sm text-[rgb(var(--color-muted-foreground))]">Pending</p>
              <p className="text-2xl font-bold text-[rgb(var(--color-foreground))]">{stats?.pending_comments || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-[rgb(var(--color-card))] p-4 rounded-lg border border-[rgb(var(--color-border))]">
          <div className="flex items-center">
            <Icon icon="lucide:check-circle" width={20} height={20} className="text-green-500 mr-3" />
            <div>
              <p className="text-sm text-[rgb(var(--color-muted-foreground))]">Approved</p>
              <p className="text-2xl font-bold text-[rgb(var(--color-foreground))]">{stats?.approved_comments || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-[rgb(var(--color-card))] p-4 rounded-lg border border-[rgb(var(--color-border))]">
          <div className="flex items-center">
            <Icon icon="lucide:x-circle" width={20} height={20} className="text-red-500 mr-3" />
            <div>
              <p className="text-sm text-[rgb(var(--color-muted-foreground))]">Rejected</p>
              <p className="text-2xl font-bold text-[rgb(var(--color-foreground))]">{stats?.rejected_comments || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[rgb(var(--color-card))] p-4 rounded-lg border border-[rgb(var(--color-border))]">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">Search comments</label>
            <div className="relative">
              <Icon icon="lucide:search" width={16} height={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[rgb(var(--color-muted-foreground))]" />
              <input
                type="text"
                id="search"
                placeholder="Search comments..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label htmlFor="status" className="sr-only">Filter by status</label>
            <select
              id="status"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as CommentFilters['status'] }))}
              className="px-4 py-2 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {showBulkActions && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800 dark:text-blue-200">
              {selectedComments.length} comment{selectedComments.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('approve')}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Table */}
      <div className="bg-[rgb(var(--color-card))] rounded-lg border border-[rgb(var(--color-border))] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[rgb(var(--color-muted))]">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedComments.length === comments.length && comments.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-[rgb(var(--color-border))]"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[rgb(var(--color-foreground))]">Author</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[rgb(var(--color-foreground))]">Comment</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[rgb(var(--color-foreground))]">Post</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[rgb(var(--color-foreground))]">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[rgb(var(--color-foreground))]">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[rgb(var(--color-foreground))]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgb(var(--color-border))]">
              {comments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    <Icon icon="lucide:message-square" width={48} height={48} className="mx-auto text-[rgb(var(--color-muted-foreground))] mb-4" />
                    <p className="text-[rgb(var(--color-muted-foreground))]">
                      No comments found matching your criteria.
                    </p>
                  </td>
                </tr>
              ) : (
                comments.map((comment) => (
                  <tr key={comment.id} className="hover:bg-[rgb(var(--color-muted))] transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedComments.includes(comment.id)}
                        onChange={() => handleSelectComment(comment.id)}
                        className="rounded border-[rgb(var(--color-border))]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-[rgb(var(--color-foreground))]">{comment.author_name}</p>
                        <p className="text-sm text-[rgb(var(--color-muted-foreground))]">{comment.author_email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-[rgb(var(--color-foreground))] line-clamp-3 max-w-xs">
                        {comment.content}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-[rgb(var(--color-foreground))] font-medium">
                        {comment.post_title || 'Unknown Post'}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(comment.status)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-[rgb(var(--color-muted-foreground))]">
                        {formatRelativeTime(new Date(comment.created_at))}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        {comment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => approveComment(comment.id)}
                              className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                              title="Approve"
                            >
                              <Icon icon="lucide:check" width={16} height={16} />
                            </button>
                            <button
                              onClick={() => rejectComment(comment.id)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                              title="Reject"
                            >
                              <Icon icon="lucide:x" width={16} height={16} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteComment(comment.id)}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          title="Delete"
                        >
                          <Icon icon="lucide:trash-2" width={16} height={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 