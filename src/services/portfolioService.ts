import { api, ApiResponse } from './api';

// Backend types (based on the Rust models)
export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
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

export interface PortfolioStats {
  total_projects: number;
  completed_projects: number;
  in_progress_projects: number;
  featured_projects: number;
  projects_this_year: number;
}

export class PortfolioService {
  // Public endpoints (for frontend display)
  static async getAllProjects(params?: {
    page?: number;
    limit?: number;
    category?: string;
    featured?: boolean;
  }): Promise<ApiResponse<PortfolioProjectsResponse>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString());
    
    const endpoint = `/portfolio/public${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return api.get<PortfolioProjectsResponse>(endpoint);
  }

  static async getProject(id: string): Promise<ApiResponse<PortfolioProject>> {
    return api.get<PortfolioProject>(`/portfolio/public/${id}`);
  }

  static async getProjectBySlug(slug: string): Promise<ApiResponse<PortfolioProject>> {
    return api.get<PortfolioProject>(`/portfolio/public/slug/${slug}`);
  }

  static async getFeaturedProjects(): Promise<ApiResponse<PortfolioProjectsResponse>> {
    return api.get<PortfolioProjectsResponse>('/portfolio/public/featured');
  }

  // Admin endpoints (for admin management)
  static async getAllProjectsAdmin(params?: {
    page?: number;
    limit?: number;
    category?: string;
    featured?: boolean;
    status?: string;
  }): Promise<ApiResponse<PortfolioProjectsResponse>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString());
    if (params?.status) searchParams.append('status', params.status);
    
    const endpoint = `/portfolio${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return api.get<PortfolioProjectsResponse>(endpoint);
  }

  static async getProjectAdmin(id: string): Promise<ApiResponse<PortfolioProject>> {
    return api.get<PortfolioProject>(`/portfolio/${id}`);
  }

  static async createProject(project: Partial<PortfolioProject>): Promise<ApiResponse<PortfolioProject>> {
    return api.post<PortfolioProject>('/portfolio', project);
  }

  static async updateProject(id: string, project: Partial<PortfolioProject>): Promise<ApiResponse<PortfolioProject>> {
    return api.put<PortfolioProject>(`/portfolio/${id}`, project);
  }

  static async deleteProject(id: string): Promise<ApiResponse<void>> {
    return api.delete<void>(`/portfolio/${id}`);
  }

  static async getPortfolioStats(): Promise<ApiResponse<PortfolioStats>> {
    return api.get<PortfolioStats>('/portfolio/stats');
  }
} 