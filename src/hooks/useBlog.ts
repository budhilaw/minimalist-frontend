import { useState, useEffect } from 'react';
import { BlogService, BlogPost, PostsResponse } from '../services/blogService';

interface UseBlogState {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
  total: number;
}

interface UseSinglePostState {
  post: BlogPost | null;
  loading: boolean;
  error: string | null;
}

export const useBlog = (params?: {
  page?: number;
  limit?: number;
  category?: string;
  published?: boolean;
  featured?: boolean;
}) => {
  const [state, setState] = useState<UseBlogState>({
    posts: [],
    loading: true,
    error: null,
    total: 0,
  });

  useEffect(() => {
    const fetchPosts = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const response = await BlogService.getAllPosts(params);
        
        if (response.error) {
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            error: response.error || 'Failed to fetch posts'
          }));
          return;
        }

        if (response.data) {
          setState({
            posts: response.data.posts,
            total: response.data.total,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch posts',
        }));
      }
    };

    fetchPosts();
  }, [params?.page, params?.limit, params?.category, params?.published, params?.featured]);

  return state;
};

export const usePublishedPosts = (params?: {
  page?: number;
  limit?: number;
}) => {
  const [state, setState] = useState<UseBlogState>({
    posts: [],
    loading: true,
    error: null,
    total: 0,
  });

  useEffect(() => {
    const fetchPublishedPosts = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const response = await BlogService.getPublishedPosts(params);
        
        if (response.error) {
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            error: response.error || 'Failed to fetch published posts'
          }));
          return;
        }

        if (response.data) {
          setState({
            posts: response.data.posts,
            total: response.data.total,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch published posts',
        }));
      }
    };

    fetchPublishedPosts();
  }, [params?.page, params?.limit]);

  return state;
};

export const useFeaturedPosts = () => {
  const [state, setState] = useState<UseBlogState>({
    posts: [],
    loading: true,
    error: null,
    total: 0,
  });

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const response = await BlogService.getFeaturedPosts();
        
        if (response.error) {
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            error: response.error || 'Failed to fetch featured posts'
          }));
          return;
        }

        if (response.data) {
          setState({
            posts: response.data.posts,
            total: response.data.total,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch featured posts',
        }));
      }
    };

    fetchFeaturedPosts();
  }, []);

  return state;
};

export const useSinglePost = (slug: string | undefined, isPreview: boolean = false) => {
  const [state, setState] = useState<UseSinglePostState>({
    post: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!slug) {
      setState({ post: null, loading: false, error: 'No post slug provided' });
      return;
    }

    const fetchPost = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const response = await BlogService.getPostBySlug(slug, isPreview);
        
        if (response.error) {
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            error: response.error || 'Failed to fetch post'
          }));
          return;
        }

        if (response.data) {
          setState({
            post: response.data,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch post',
        }));
      }
    };

    fetchPost();
  }, [slug, isPreview]);

  return state;
}; 