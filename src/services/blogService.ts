import { apiClient, ApiResponse } from '../utils/api';

// Backend types (based on the Rust models)
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category: string;
  tags: string[];
  featured_image?: string;
  featured: boolean;
  published: boolean;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  view_count: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PostsResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export class BlogService {
  static async getAllPosts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    published?: boolean;
    featured?: boolean;
  }): Promise<ApiResponse<PostsResponse>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.published !== undefined) queryParams.append('published', params.published.toString());
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());

    const endpoint = `/posts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<PostsResponse>(endpoint);
  }

  static async getPublishedPosts(params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PostsResponse>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const endpoint = `/posts/published${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<PostsResponse>(endpoint);
  }

  static async getFeaturedPosts(): Promise<ApiResponse<PostsResponse>> {
    return apiClient.get<PostsResponse>('/posts/featured');
  }

  static async getPost(id: string): Promise<ApiResponse<BlogPost>> {
    return apiClient.get<BlogPost>(`/posts/${id}`);
  }

  static async getPostBySlug(slug: string): Promise<ApiResponse<BlogPost>> {
    return apiClient.get<BlogPost>(`/posts/slug/${slug}`);
  }
} 