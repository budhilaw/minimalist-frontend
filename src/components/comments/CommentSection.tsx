import React from 'react';
import { Icon } from '@iconify/react';
import { useComments } from '../../hooks/useComments';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';

interface CommentSectionProps {
  postId?: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const {
    comments,
    topLevelComments,
    replyingTo,
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

  return (
    <div className="mt-16 pt-8 border-t border-[rgb(var(--color-border))]">
      {/* Comments Header */}
      <div className="flex items-center mb-8">
        <Icon icon="lucide:message-circle" width={24} height={24} className="mr-3 text-[rgb(var(--color-primary))]" />
        <h2 className="text-2xl font-bold text-[rgb(var(--color-foreground))]">
          Comments ({comments.length})
        </h2>
      </div>

      {/* Main Comment Form */}
      <div className="mb-12">
        <h3 className="text-lg font-semibold text-[rgb(var(--color-foreground))] mb-4">
          Leave a Comment
        </h3>
        <CommentForm onSubmit={addComment} />
      </div>

      {/* Comments List */}
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
    </div>
  );
}; 