import { useState } from 'react';
import { Comment, CommentFormData } from '../types/comment';

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
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // Add a new comment
  const addComment = (formData: CommentFormData) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      content: formData.content,
      timestamp: new Date(),
      likes: 0,
      isLiked: false
    };
    setComments(prev => [newComment, ...prev]);
  };

  // Add a reply to a specific comment
  const addReply = (parentId: string, formData: CommentFormData) => {
    const newReply: Comment = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      content: formData.content,
      timestamp: new Date(),
      parentId,
      likes: 0,
      isLiked: false
    };
    setComments(prev => [newReply, ...prev]);
    setReplyingTo(null);
  };

  // Toggle like on a comment
  const toggleLike = (commentId: string) => {
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
  };

  // Toggle reply form for a comment
  const toggleReply = (commentId: string) => {
    setReplyingTo(prev => prev === commentId ? null : commentId);
  };

  // Get top-level comments (not replies)
  const topLevelComments = comments.filter(comment => !comment.parentId);

  // Get replies for a specific comment
  const getCommentReplies = (commentId: string) =>
    comments.filter(comment => comment.parentId === commentId);

  return {
    comments,
    topLevelComments,
    replyingTo,
    addComment,
    addReply,
    toggleLike,
    toggleReply,
    getCommentReplies,
    setReplyingTo
  };
}; 