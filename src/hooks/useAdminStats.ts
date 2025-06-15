import { useState, useEffect } from 'react';
import { postsService } from '../services/postsService';
import { PortfolioService } from '../services/portfolioService';
import { ServiceService } from '../services/serviceService';
import { CommentsService } from '../services/commentsService';

interface AdminStats {
  totalPosts: number;
  totalComments: number;
  totalPortfolios: number;
  totalServices: number;
  loading: boolean;
  error: string | null;
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalPosts: 0,
    totalComments: 0,
    totalPortfolios: 0,
    totalServices: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true, error: null }));

        // Fetch all stats in parallel
        const [postsResponse, portfolioResponse, serviceResponse, commentsResponse] = await Promise.all([
          postsService.getPostStats(),
          PortfolioService.getPortfolioStats(),
          ServiceService.getServiceStats(),
          CommentsService.getCommentStats(),
        ]);

        // Extract totals from each response
        const totalPosts = postsResponse.data?.total_posts || 0;
        const totalPortfolios = portfolioResponse.data?.total_projects || 0;
        const totalServices = serviceResponse.data?.total_services || 0;
        const totalComments = commentsResponse.data?.total_comments || 0;

        setStats({
          totalPosts,
          totalComments,
          totalPortfolios,
          totalServices,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch statistics',
        }));
      }
    };

    fetchStats();
  }, []);

  return stats;
}; 