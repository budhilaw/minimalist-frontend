import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { CommentFormData } from '../../types/comment';

interface CommentFormProps {
  onSubmit: (formData: CommentFormData) => void;
  onCancel?: () => void;
  placeholder?: string;
  buttonText?: string;
  isReply?: boolean;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  onCancel,
  placeholder = "Share your thoughts...",
  buttonText = "Post Comment",
  isReply = false
}) => {
  const [formData, setFormData] = useState<CommentFormData>({
    name: '',
    email: '',
    content: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.content) {
      onSubmit(formData);
      setFormData({ name: '', email: '', content: '' });
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', email: '', content: '' });
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-${isReply ? '3' : '4'}`}>
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-${isReply ? '3' : '4'}`}>
        <div>
          <label 
            htmlFor={`name-${isReply ? 'reply' : 'comment'}`} 
            className={`block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2 ${isReply ? 'sr-only' : ''}`}
          >
            Name *
          </label>
          <input
            type="text"
            id={`name-${isReply ? 'reply' : 'comment'}`}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-${isReply ? '3' : '4'} py-${isReply ? '2' : '3'} border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-muted))] text-[rgb(var(--color-foreground))] ${isReply ? 'text-sm' : ''} focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent`}
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <label 
            htmlFor={`email-${isReply ? 'reply' : 'comment'}`} 
            className={`block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2 ${isReply ? 'sr-only' : ''}`}
          >
            Email *
          </label>
          <input
            type="email"
            id={`email-${isReply ? 'reply' : 'comment'}`}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full px-${isReply ? '3' : '4'} py-${isReply ? '2' : '3'} border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-muted))] text-[rgb(var(--color-foreground))] ${isReply ? 'text-sm' : ''} focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent`}
            placeholder="your.email@example.com"
            required
          />
        </div>
      </div>
      <div>
        <label 
          htmlFor={`content-${isReply ? 'reply' : 'comment'}`} 
          className={`block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2 ${isReply ? 'sr-only' : ''}`}
        >
          Comment *
        </label>
        <textarea
          id={`content-${isReply ? 'reply' : 'comment'}`}
          rows={isReply ? 3 : 5}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className={`w-full px-${isReply ? '3' : '4'} py-${isReply ? '2' : '3'} border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-muted))] text-[rgb(var(--color-foreground))] ${isReply ? 'text-sm' : ''} focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent resize-none`}
          placeholder={placeholder}
          required
        />
      </div>
      <div className="flex space-x-2">
        <button
          type="submit"
          className={`inline-flex items-center px-${isReply ? '4' : '6'} py-${isReply ? '2' : '3'} bg-[rgb(var(--color-primary))] text-white ${isReply ? 'text-sm' : ''} rounded-md hover:bg-[rgb(var(--color-primary))]/90 transition-colors duration-200`}
        >
          <Icon icon="lucide:send" size={isReply ? 14 : 16} className="mr-2" />
          {buttonText}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={handleCancel}
            className={`px-${isReply ? '4' : '6'} py-${isReply ? '2' : '3'} border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] ${isReply ? 'text-sm' : ''} rounded-md hover:bg-[rgb(var(--color-muted))] transition-colors duration-200`}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}; 