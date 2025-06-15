import { api, ApiResponse } from './api';

// Backend types (based on the Rust models)
export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  category: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServicesResponse {
  services: Service[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface CategoryCount {
  category: string;
  count: number;
}

export interface ServiceStats {
  total_services: number;
  active_services: number;
  inactive_services: number;
  services_by_category: CategoryCount[];
}

export class ServiceService {
  // Public endpoints (for frontend display)
  static async getAllServices(params?: {
    page?: number;
    limit?: number;
    category?: string;
    active?: boolean;
  }): Promise<ApiResponse<ServicesResponse>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.active !== undefined) searchParams.append('active', params.active.toString());
    
    const endpoint = `/services/public${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return api.get<ServicesResponse>(endpoint);
  }

  static async getService(id: string): Promise<ApiResponse<Service>> {
    return api.get<Service>(`/services/public/${id}`);
  }

  static async getActiveServices(): Promise<ApiResponse<ServicesResponse>> {
    return api.get<ServicesResponse>('/services/public/active');
  }

  // Admin endpoints (for admin management)
  static async getAllServicesAdmin(params?: {
    page?: number;
    limit?: number;
    category?: string;
    active?: boolean;
  }): Promise<ApiResponse<ServicesResponse>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.active !== undefined) searchParams.append('active', params.active.toString());
    
    const endpoint = `/services${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return api.get<ServicesResponse>(endpoint);
  }

  static async getServiceAdmin(id: string): Promise<ApiResponse<Service>> {
    return api.get<Service>(`/services/${id}`);
  }

  static async createService(service: Partial<Service>): Promise<ApiResponse<Service>> {
    return api.post<Service>('/services', service);
  }

  static async updateService(id: string, service: Partial<Service>): Promise<ApiResponse<Service>> {
    return api.put<Service>(`/services/${id}`, service);
  }

  static async deleteService(id: string): Promise<ApiResponse<void>> {
    return api.delete<void>(`/services/${id}`);
  }

  static async getServiceStats(): Promise<ApiResponse<ServiceStats>> {
    return api.get<ServiceStats>('/services/stats');
  }
} 