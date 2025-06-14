import { useState, useEffect, useCallback } from 'react';

// API base URL
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export interface AdminComment {
  id: string;
  post_id: string;
  post_title: string;
  author_name: string;
  author_email: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  ip_address?: string;
  user_agent?: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CommentStats {
  total_comments: number;
  pending_comments: number;
  approved_comments: number;
  rejected_comments: number;
  comments_this_month: number;
}

interface CommentFilters {
  status: 'all' | 'pending' | 'approved' | 'rejected';
  search: string;
  postId?: string;
}

export const useAdminComments = (filters: CommentFilters) => {
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [stats, setStats] = useState<CommentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch comments based on filters
  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.status !== 'all') {
        params.append('status', filters.status);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.postId) {
        params.append('post_id', filters.postId);
      }

      const response = await fetch(`${API_BASE_URL}/comments?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      const data = await response.json();
      setComments(data.comments || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comments');
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch comment statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/stats`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch comment stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch comment stats:', err);
      // Don't set error for stats failure, just log it
    }
  }, []);

  // Approve a comment
  const approveComment = useCallback(async (commentId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}/approve`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve comment');
      }

      // Update local state
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, status: 'approved' as const }
            : comment
        )
      );

      // Refresh stats
      fetchStats();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to approve comment');
    }
  }, [fetchStats]);

  // Reject a comment
  const rejectComment = useCallback(async (commentId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}/reject`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reject comment');
      }

      // Update local state
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, status: 'rejected' as const }
            : comment
        )
      );

      // Refresh stats
      fetchStats();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to reject comment');
    }
  }, [fetchStats]);

  // Delete a comment
  const deleteComment = useCallback(async (commentId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      // Remove from local state
      setComments(prev => prev.filter(comment => comment.id !== commentId));

      // Refresh stats
      fetchStats();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete comment');
    }
  }, [fetchStats]);

  // Bulk update comment status
  const bulkUpdateStatus = useCallback(async (commentIds: string[], status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/bulk-status`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: commentIds,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to bulk update comments');
      }

      // Update local state
      setComments(prev => 
        prev.map(comment => 
          commentIds.includes(comment.id)
            ? { ...comment, status }
            : comment
        )
      );

      // Refresh stats
      fetchStats();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to bulk update comments');
    }
  }, [fetchStats]);

  // Refresh comments and stats
  const refreshComments = useCallback(() => {
    fetchComments();
    fetchStats();
  }, [fetchComments, fetchStats]);

  // Initial load and when filters change
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Load stats on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    comments,
    stats,
    loading,
    error,
    approveComment,
    rejectComment,
    deleteComment,
    bulkUpdateStatus,
    refreshComments,
  };
}; 