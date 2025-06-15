import { api, ApiResponse } from './api';

// Backend types (based on the Rust models)
export interface Comment {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string;
  content: string;
  status: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CommentsResponse {
  comments: Comment[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface CommentStats {
  total_comments: number;
  pending_comments: number;
  approved_comments: number;
  rejected_comments: number;
  comments_this_month: number;
}

export class CommentsService {
  static async getCommentsByPost(postId: string): Promise<ApiResponse<CommentsResponse>> {
    return api.get<CommentsResponse>(`/comments/post/${postId}`);
  }

  static async getAllComments(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<ApiResponse<CommentsResponse>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    
    const endpoint = `/comments${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return api.get<CommentsResponse>(endpoint);
  }

  static async getCommentStats(): Promise<ApiResponse<CommentStats>> {
    return api.get<CommentStats>('/comments/stats');
  }

  static async createComment(comment: {
    post_id: string;
    author_name: string;
    author_email: string;
    content: string;
    parent_id?: string;
  }): Promise<ApiResponse<Comment>> {
    return api.post<Comment>('/comments', comment);
  }

  static async updateComment(id: string, updates: {
    status?: string;
    content?: string;
  }): Promise<ApiResponse<Comment>> {
    return api.put<Comment>(`/comments/${id}`, updates);
  }

  static async deleteComment(id: string): Promise<ApiResponse<void>> {
    return api.delete<void>(`/comments/${id}`);
  }
} 