import { useState, useEffect } from 'react';
import { PortfolioService, PortfolioProject, PortfolioProjectsResponse } from '../services/portfolioService';

interface UsePortfolioState {
  projects: PortfolioProject[];
  loading: boolean;
  error: string | null;
  total: number;
}

export const usePortfolio = (params?: {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
}) => {
  const [state, setState] = useState<UsePortfolioState>({
    projects: [],
    loading: true,
    error: null,
    total: 0,
  });

  useEffect(() => {
    const fetchProjects = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const response = await PortfolioService.getAllProjects(params);
        
        if (response.error) {
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            error: response.error || 'Failed to fetch projects'
          }));
          return;
        }

        if (response.data) {
          setState({
            projects: response.data.projects,
            total: response.data.total,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch projects',
        }));
      }
    };

    fetchProjects();
  }, [params?.page, params?.limit, params?.category, params?.featured]);

  return state;
};

export const useFeaturedProjects = () => {
  const [state, setState] = useState<UsePortfolioState>({
    projects: [],
    loading: true,
    error: null,
    total: 0,
  });

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const response = await PortfolioService.getFeaturedProjects();
        
        if (response.error) {
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            error: response.error || 'Failed to fetch featured projects'
          }));
          return;
        }

        if (response.data) {
          setState({
            projects: response.data.projects,
            total: response.data.total,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch featured projects',
        }));
      }
    };

    fetchFeaturedProjects();
  }, []);

  return state;
}; 