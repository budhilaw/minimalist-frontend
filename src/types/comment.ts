// Comment-related type definitions
export interface Comment {
  id: string;
  name: string;
  email: string;
  content: string;
  timestamp: Date;
  parentId?: string;
  likes: number;
  isLiked: boolean;
}

export interface CommentFormData {
  name: string;
  email: string;
  content: string;
} 