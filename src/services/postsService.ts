import { api, ApiResponse } from './api';

export interface PostAuthor {
  name: string;
  role: string;
}

export interface Post {
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

export interface BlogPost extends Post {
  author: PostAuthor;
  readTime: string;
  publishDate: string;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  page?: number;
  limit?: number;
  total_pages?: number;
}

export interface PostStats {
  total_posts: number;
  published_posts: number;
  draft_posts: number;
  featured_posts: number;
  posts_this_month: number;
  total_views: number;
}

export interface CreatePostRequest {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category: string;
  tags: string[];
  featured_image?: string;
  featured?: boolean;
  published?: boolean;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
}

export interface UpdatePostRequest extends CreatePostRequest {}

export interface PostQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  published?: boolean;
  featured?: boolean;
}

class PostsService {
  async getAllPosts(query?: PostQuery): Promise<ApiResponse<PostsResponse>> {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    const endpoint = `/posts${params.toString() ? `?${params}` : ''}`;
    return api.get<PostsResponse>(endpoint);
  }

  async getPublishedPosts(limit?: number): Promise<ApiResponse<PostsResponse>> {
    const params = limit ? `?limit=${limit}` : '';
    return api.get<PostsResponse>(`/posts/published${params}`);
  }

  async getFeaturedPosts(limit?: number): Promise<ApiResponse<PostsResponse>> {
    const params = limit ? `?limit=${limit}` : '';
    return api.get<PostsResponse>(`/posts/featured${params}`);
  }

  async getPostById(id: string): Promise<ApiResponse<Post>> {
    return api.get<Post>(`/posts/${id}`);
  }

  async getPostBySlug(slug: string): Promise<ApiResponse<Post>> {
    return api.get<Post>(`/posts/slug/${slug}`);
  }

  async createPost(data: CreatePostRequest): Promise<ApiResponse<{ message: string; post: Post }>> {
    return api.post<{ message: string; post: Post }>('/posts', data);
  }

  async updatePost(id: string, data: UpdatePostRequest): Promise<ApiResponse<{ message: string; post: Post }>> {
    return api.put<{ message: string; post: Post }>(`/posts/${id}`, data);
  }

  async deletePost(id: string): Promise<ApiResponse<{ message: string }>> {
    return api.delete<{ message: string }>(`/posts/${id}`);
  }

  async getPostStats(): Promise<ApiResponse<PostStats>> {
    return api.get<PostStats>('/posts/stats');
  }

  async updatePublishedStatus(id: string, published: boolean): Promise<ApiResponse<{ message: string; post: Post }>> {
    return api.put<{ message: string; post: Post }>(`/posts/${id}/publish`, { published });
  }

  // Helper function to convert backend Post to frontend BlogPost
  convertToLegacyFormat(post: Post): BlogPost {
    // Calculate read time based on content length (rough estimate)
    const wordsPerMinute = 200;
    const wordCount = post.content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);

    return {
      ...post,
      author: {
        name: 'Admin', // Default author since backend doesn't have author info yet
        role: 'Administrator'
      },
      readTime: `${readTime} min read`,
      publishDate: post.published_at || post.created_at
    };
  }

  // Helper function to convert multiple posts
  convertMultipleToLegacyFormat(posts: Post[]): BlogPost[] {
    return posts.map(post => this.convertToLegacyFormat(post));
  }
}

export const postsService = new PostsService(); 