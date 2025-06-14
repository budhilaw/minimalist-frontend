import { useState, useEffect, useCallback } from 'react';
import { Comment, CommentFormData } from '../types/comment';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

// API base URL
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Sample data - in a real app, this would come from an API
const initialComments: Comment[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    content: 'Great article! The explanation of microservices architecture was really clear and helpful. I\'ve been struggling with implementing this pattern in my current project, and your insights have given me some new ideas to try.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    likes: 5,
    isLiked: false
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@example.com',
    content: 'Thanks for sharing this! Quick question - how do you handle database migrations when working with multiple microservices? This has been a challenge for our team.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    likes: 2,
    isLiked: true
  },
  {
    id: '3',
    name: 'Ericsson Budhilaw',
    email: 'ericsson@budhilaw.com',
    content: '@Mike Chen Great question! For database migrations with microservices, I typically use a versioned approach where each service manages its own database schema. I might write a detailed post about this topic soon!',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    parentId: '2',
    likes: 3,
    isLiked: false
  }
];

export const useComments = (postId?: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { settings } = useSiteSettings();

  // Check if comments are enabled
  const commentsEnabled = settings?.features?.comments_enabled ?? true;

  // Fetch comments for a specific post
  const fetchComments = useCallback(async () => {
    if (!postId || !commentsEnabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/comments/post/${postId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      const data = await response.json();
      
      // Convert backend comments to frontend format
      const convertedComments: Comment[] = (data.comments || []).map((comment: any) => ({
        id: comment.id,
        name: comment.author_name,
        email: comment.author_email,
        content: comment.content,
        timestamp: new Date(comment.created_at),
        parentId: comment.parent_id,
        likes: 0, // Backend doesn't have likes yet
        isLiked: false,
      }));

      setComments(convertedComments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comments');
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [postId, commentsEnabled]);

  // Add a new comment
  const addComment = useCallback(async (formData: CommentFormData) => {
    if (!postId || !commentsEnabled) {
      throw new Error('Comments are not available');
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId,
          author_name: formData.name,
          author_email: formData.email,
          content: formData.content,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Handle structured error response from backend
        const errorMessage = errorData.error?.message || errorData.message || 'Failed to submit comment';
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Show success message
      if (data.message) {
        setSuccessMessage(data.message);
      }

      // Refresh comments to show the new one (if approved) or show pending message
      await fetchComments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit comment');
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [postId, commentsEnabled, fetchComments]);

  // Add a reply to a specific comment
  const addReply = useCallback(async (parentId: string, formData: CommentFormData) => {
    if (!postId || !commentsEnabled) {
      throw new Error('Comments are not available');
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId,
          author_name: formData.name,
          author_email: formData.email,
          content: formData.content,
          parent_id: parentId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Handle structured error response from backend
        const errorMessage = errorData.error?.message || errorData.message || 'Failed to submit reply';
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Show success message
      if (data.message) {
        setSuccessMessage(data.message);
      }

      setReplyingTo(null);
      
      // Refresh comments to show the new reply (if approved)
      await fetchComments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit reply');
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [postId, commentsEnabled, fetchComments]);

  // Toggle like on a comment (local only for now)
  const toggleLike = useCallback((commentId: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          isLiked: !comment.isLiked
        };
      }
      return comment;
    }));
  }, []);

  // Toggle reply form for a comment
  const toggleReply = useCallback((commentId: string) => {
    setReplyingTo(prev => prev === commentId ? null : commentId);
  }, []);

  // Get top-level comments (not replies)
  const topLevelComments = comments.filter(comment => !comment.parentId);

  // Get replies for a specific comment
  const getCommentReplies = useCallback((commentId: string) =>
    comments.filter(comment => comment.parentId === commentId),
    [comments]
  );

  // Load comments when component mounts or postId changes
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return {
    comments,
    topLevelComments,
    replyingTo,
    loading,
    error,
    submitting,
    successMessage,
    commentsEnabled,
    addComment,
    addReply,
    toggleLike,
    toggleReply,
    getCommentReplies,
    setReplyingTo,
    refreshComments: fetchComments,
  };
}; 