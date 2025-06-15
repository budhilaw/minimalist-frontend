const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api/v1';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      
      const config: RequestInit = {
        credentials: 'include', // Include HTTP-only cookies
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        
        // Handle different error response formats
        let errorMessage: string;
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.message) {
          // Backend returns {code, message, timestamp} format
          errorMessage = errorData.message;
        } else if (errorData.error) {
          // Fallback to error field
          errorMessage = errorData.error;
        } else {
          errorMessage = `HTTP ${response.status}`;
        }
        
        return { error: errorMessage };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiService(); 