import { apiClient, ApiResponse } from '../utils/api';

export interface UpdateProfileRequest {
  full_name: string;
  username: string;
  email: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdateResponse {
  success: boolean;
  data: {
    user: UserProfile;
  };
  message: string;
}

export interface PasswordChangeResponse {
  success: boolean;
  message: string;
  requires_reauth?: boolean;
}

export class ProfileService {
  static async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<ProfileUpdateResponse>> {
    return apiClient.put<ProfileUpdateResponse>('/auth/profile', data);
  }

  static async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<PasswordChangeResponse>> {
    return apiClient.put<PasswordChangeResponse>('/auth/change-password', data);
  }

  static async getCurrentUser(): Promise<ApiResponse<{ user: UserProfile }>> {
    return apiClient.get<{ user: UserProfile }>('/auth/me');
  }
} 