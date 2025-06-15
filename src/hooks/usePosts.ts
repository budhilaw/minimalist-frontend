import { useState, useEffect, useCallback } from 'react';
import { postsService, Post, BlogPost, PostStats, PostQuery } from '../services/postsService';

export interface UsePostsReturn {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
  stats: PostStats | null;
  totalPosts: number;
  refetch: () => Promise<void>;
  createPost: (data: any) => Promise<boolean>;
  updatePost: (id: string, data: any) => Promise<boolean>;
  deletePost: (id: string) => Promise<boolean>;
  updatePublishedStatus: (id: string, published: boolean) => Promise<boolean>;
}

export const usePosts = (query?: PostQuery): UsePostsReturn => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<PostStats | null>(null);
  const [totalPosts, setTotalPosts] = useState(0);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await postsService.getAllPosts(query);
      
      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        const convertedPosts = postsService.convertMultipleToLegacyFormat(response.data.posts);
        setPosts(convertedPosts);
        setTotalPosts(response.data.total || 0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, [query]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await postsService.getPostStats();
      if (response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch post stats:', err);
    }
  }, []);

  const createPost = useCallback(async (data: any): Promise<boolean> => {
    try {
      setError(null);
      const response = await postsService.createPost(data);
      
      if (response.error) {
        setError(response.error);
        return false;
      }

      await fetchPosts();
      await fetchStats();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      return false;
    }
  }, [fetchPosts, fetchStats]);

  const updatePost = useCallback(async (id: string, data: any): Promise<boolean> => {
    try {
      setError(null);
      const response = await postsService.updatePost(id, data);
      
      if (response.error) {
        setError(response.error);
        return false;
      }

      await fetchPosts();
      await fetchStats();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post');
      return false;
    }
  }, [fetchPosts, fetchStats]);

  const deletePost = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const response = await postsService.deletePost(id);
      
      if (response.error) {
        setError(response.error);
        return false;
      }

      await fetchPosts();
      await fetchStats();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
      return false;
    }
  }, [fetchPosts, fetchStats]);

  const updatePublishedStatus = useCallback(async (id: string, published: boolean): Promise<boolean> => {
    try {
      setError(null);
      const response = await postsService.updatePublishedStatus(id, published);
      
      if (response.error) {
        setError(response.error);
        return false;
      }

      await fetchPosts();
      await fetchStats();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post status');
      return false;
    }
  }, [fetchPosts, fetchStats]);

  const refetch = useCallback(async () => {
    await Promise.all([fetchPosts(), fetchStats()]);
  }, [fetchPosts, fetchStats]);

  useEffect(() => {
    fetchPosts();
    fetchStats();
  }, [fetchPosts, fetchStats]);

  return {
    posts,
    loading,
    error,
    stats,
    totalPosts,
    refetch,
    createPost,
    updatePost,
    deletePost,
    updatePublishedStatus,
  };
}; 