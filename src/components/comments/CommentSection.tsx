import React from 'react';
import { Icon } from '@iconify/react';
import { useComments } from '../../hooks/useComments';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';
import { LoadingSpinner, ErrorMessage } from '../LoadingSpinner';

interface CommentSectionProps {
  postId?: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const {
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
    setReplyingTo
  } = useComments(postId);

  const handleReplySubmit = (parentId: string, formData: any) => {
    addReply(parentId, formData);
  };

  const handleCommentSubmit = async (formData: any) => {
    try {
      await addComment(formData);
    } catch (error) {
      // Error is already handled in the hook
      console.error('Failed to submit comment:', error);
    }
  };

  // Don't render anything if comments are disabled
  if (!commentsEnabled) {
    return (
      <div className="mt-16 pt-8 border-t border-[rgb(var(--color-border))]">
        <div className="text-center py-8">
          <Icon icon="lucide:message-circle-off" width={48} height={48} className="mx-auto text-[rgb(var(--color-muted-foreground))] mb-4" />
          <p className="text-[rgb(var(--color-muted-foreground))]">
            Comments are currently disabled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 pt-8 border-t border-[rgb(var(--color-border))]">
      {/* Comments Header */}
      <div className="flex items-center mb-8">
        <Icon icon="lucide:message-circle" width={24} height={24} className="mr-3 text-[rgb(var(--color-primary))]" />
        <h2 className="text-2xl font-bold text-[rgb(var(--color-foreground))]">
          Comments ({comments.length})
        </h2>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6">
          {error.includes('Too many comments') ? (
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="flex items-start">
                <Icon 
                  icon="lucide:clock" 
                  width={20} 
                  height={20} 
                  className="text-orange-600 dark:text-orange-400 mr-3 mt-0.5 flex-shrink-0" 
                />
                <div>
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-200 mb-1">
                    Rate Limit Reached
                  </p>
                  <p className="text-sm text-orange-700 dark:text-orange-300">{error}</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                    This helps prevent spam and ensures quality discussions. Please try again in a few minutes.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <ErrorMessage message={error} />
          )}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-start">
              <Icon 
                icon="lucide:check-circle" 
                width={20} 
                height={20} 
                className="text-green-600 dark:text-green-400 mr-3 mt-0.5 flex-shrink-0" 
              />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
                  Comment Submitted Successfully
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">{successMessage}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  Thank you for your contribution! Your comment will appear once it has been reviewed.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Comment Form */}
      <div className="mb-12">
        <h3 className="text-lg font-semibold text-[rgb(var(--color-foreground))] mb-4">
          Leave a Comment
        </h3>
        <CommentForm 
          onSubmit={handleCommentSubmit}
          disabled={submitting}
        />
        {submitting && (
          <div className="mt-4 flex items-center text-[rgb(var(--color-muted-foreground))]">
            <Icon icon="lucide:loader2" width={16} height={16} className="animate-spin mr-2" />
            <span>Submitting your comment...</span>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : (
        /* Comments List */
        <div className="space-y-6">
          {topLevelComments.length > 0 ? (
            topLevelComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                replies={getCommentReplies(comment.id)}
                onReply={toggleReply}
                onLike={toggleLike}
                onSubmitReply={handleReplySubmit}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                disabled={submitting}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <Icon icon="lucide:message-circle" width={48} height={48} className="mx-auto text-[rgb(var(--color-muted-foreground))] mb-4" />
              <p className="text-[rgb(var(--color-muted-foreground))]">
                No comments yet. Be the first to share your thoughts!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 