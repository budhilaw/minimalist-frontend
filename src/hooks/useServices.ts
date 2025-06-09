import { useState, useEffect } from 'react';
import { ServiceService, Service, ServicesResponse } from '../services/serviceService';

interface UseServicesState {
  services: Service[];
  loading: boolean;
  error: string | null;
  total: number;
}

export const useServices = (params?: {
  page?: number;
  limit?: number;
  category?: string;
  active?: boolean;
}) => {
  const [state, setState] = useState<UseServicesState>({
    services: [],
    loading: true,
    error: null,
    total: 0,
  });

  useEffect(() => {
    const fetchServices = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const response = await ServiceService.getAllServices(params);
        
        if (response.error) {
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            error: response.error || 'Failed to fetch services'
          }));
          return;
        }

        if (response.data) {
          setState({
            services: response.data.services,
            total: response.data.total,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch services',
        }));
      }
    };

    fetchServices();
  }, [params?.page, params?.limit, params?.category, params?.active]);

  return state;
};

export const useActiveServices = () => {
  const [state, setState] = useState<UseServicesState>({
    services: [],
    loading: true,
    error: null,
    total: 0,
  });

  useEffect(() => {
    const fetchActiveServices = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const response = await ServiceService.getActiveServices();
        
        if (response.error) {
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            error: response.error || 'Failed to fetch active services'
          }));
          return;
        }

        if (response.data) {
          setState({
            services: response.data.services,
            total: response.data.total,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch active services',
        }));
      }
    };

    fetchActiveServices();
  }, []);

  return state;
}; 