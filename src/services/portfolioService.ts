import { apiClient, ApiResponse, PaginatedResponse } from '../utils/api';

// Backend types (based on the Rust models)
export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  long_description?: string;
  category: string;
  technologies: string[];
  live_url?: string;
  github_url?: string;
  image_url?: string;
  featured: boolean;
  active: boolean;
  status: string;
  start_date: string;
  end_date?: string;
  client?: string;
  created_at: string;
  updated_at: string;
}

export interface PortfolioProjectsResponse {
  projects: PortfolioProject[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export class PortfolioService {
  static async getAllProjects(params?: {
    page?: number;
    limit?: number;
    category?: string;
    featured?: boolean;
  }): Promise<ApiResponse<PortfolioProjectsResponse>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());

    const endpoint = `/portfolio/public${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<PortfolioProjectsResponse>(endpoint);
  }

  static async getProject(id: string): Promise<ApiResponse<PortfolioProject>> {
    return apiClient.get<PortfolioProject>(`/portfolio/public/${id}`);
  }

  static async getFeaturedProjects(): Promise<ApiResponse<PortfolioProjectsResponse>> {
    return apiClient.get<PortfolioProjectsResponse>('/portfolio/public/featured');
  }
} 