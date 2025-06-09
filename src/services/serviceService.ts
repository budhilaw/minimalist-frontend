import { apiClient, ApiResponse } from '../utils/api';

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

export class ServiceService {
  static async getAllServices(params?: {
    page?: number;
    limit?: number;
    category?: string;
    active?: boolean;
  }): Promise<ApiResponse<ServicesResponse>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.active !== undefined) queryParams.append('active', params.active.toString());

    const endpoint = `/services/public${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<ServicesResponse>(endpoint);
  }

  static async getActiveServices(): Promise<ApiResponse<ServicesResponse>> {
    return apiClient.get<ServicesResponse>('/services/public/active');
  }

  static async getService(id: string): Promise<ApiResponse<Service>> {
    return apiClient.get<Service>(`/services/public/${id}`);
  }
} 