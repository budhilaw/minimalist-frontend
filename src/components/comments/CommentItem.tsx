import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Comment, CommentFormData } from '../../types/comment';
import { CommentForm } from './CommentForm';
import { formatRelativeTime } from '../../utils/dateFormatter';

interface CommentItemProps {
  comment: Comment;
  replies: Comment[];
  onReply: (commentId: string) => void;
  onLike: (commentId: string) => void;
  onSubmitReply: (parentId: string, formData: CommentFormData) => void;
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  disabled?: boolean;
}

// Utility function to format comment timestamps
const formatCommentDate = (date: Date) => {
  return formatRelativeTime(date);
};

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  replies,
  onReply,
  onLike,
  onSubmitReply,
  replyingTo,
  setReplyingTo,
  disabled = false
}) => {
  const handleReplySubmit = (formData: CommentFormData) => {
    onSubmitReply(comment.id, formData);
  };

  return (
    <div className="border-l-2 border-[rgb(var(--color-border))] pl-4 ml-2">
      <div className="bg-[rgb(var(--color-background))] p-4 rounded-lg border border-[rgb(var(--color-border))]">
        {/* Comment Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[rgb(var(--color-primary))] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {comment.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h4 className="font-medium text-[rgb(var(--color-foreground))]">
                {comment.name}
              </h4>
              <p className="text-xs text-[rgb(var(--color-muted-foreground))]">
                {formatCommentDate(comment.timestamp)}
              </p>
            </div>
          </div>
        </div>

        {/* Comment Content */}
        <p className="text-[rgb(var(--color-muted-foreground))] mb-4 leading-relaxed">
          {comment.content}
        </p>

        {/* Comment Actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onLike(comment.id)}
            disabled={disabled}
            className={`flex items-center space-x-1 text-sm transition-colors duration-200 ${
              comment.isLiked 
                ? 'text-[rgb(var(--color-primary))]' 
                : 'text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-primary))]'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Icon icon="lucide:thumbs-up" width={14} height={14} className={comment.isLiked ? 'fill-current' : ''} />
            <span>{comment.likes}</span>
          </button>
          <button
            onClick={() => onReply(comment.id)}
            disabled={disabled}
            className={`flex items-center space-x-1 text-sm text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-primary))] transition-colors duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Icon icon="lucide:reply" width={14} height={14} />
            <span>Reply</span>
          </button>
        </div>

        {/* Reply Form */}
        {replyingTo === comment.id && (
          <div className="mt-4">
            <CommentForm
              onSubmit={handleReplySubmit}
              onCancel={() => setReplyingTo(null)}
              placeholder="Write your reply..."
              buttonText="Reply"
              isReply={true}
              disabled={disabled}
            />
          </div>
        )}
      </div>

      {/* Nested Replies */}
      {replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              replies={[]} // Only one level of nesting for simplicity
              onReply={onReply}
              onLike={onLike}
              onSubmitReply={onSubmitReply}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </div>
  );
}; 