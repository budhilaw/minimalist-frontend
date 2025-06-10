import { useState, useEffect, useCallback } from 'react';
import { AdminUser, LoginCredentials, AuthState } from '../types/admin';
import { TokenManager, PasswordUtils, RateLimiter, SessionManager, AuditLogger } from '../utils/security';

// API base URL
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
    error: null
  });

  // Initialize auth state from stored token
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = TokenManager.getToken();
        
        if (token && SessionManager.isSessionValid()) {
          // Verify token with backend
          try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });

            if (response.ok) {
              const data = await response.json();
              const user: AdminUser = {
                id: data.data.user.id,
                username: data.data.user.username,
                email: data.data.user.email,
                role: data.data.user.role as 'admin' | 'super_admin',
                lastLogin: new Date(data.data.user.last_login || Date.now()),
                isActive: data.data.user.is_active
              };

              setAuthState({
                user,
                token,
                isAuthenticated: true,
                loading: false,
                error: null
              });
              
              // Log successful session restoration
              AuditLogger.log('SESSION_RESTORED', { userId: user.id });
              return;
            }
          } catch (error) {
            // Token verification failed - this is expected for expired tokens
          }
        }

        // Clear invalid session
        TokenManager.clearToken();
        SessionManager.endSession();
        setAuthState(prev => ({ ...prev, loading: false }));
      } catch (error) {
        setAuthState(prev => ({ ...prev, loading: false, error: 'Authentication initialization failed' }));
      }
    };

    initializeAuth();
  }, []);

  // Login function using backend API
  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    const { username, password } = credentials;

    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

      // Call backend login API (backend now handles rate limiting)
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        const { token, user: userData, expires_at } = data.data;

        // Create user object
        const user: AdminUser = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          role: userData.role as 'admin' | 'super_admin',
          lastLogin: new Date(userData.last_login || Date.now()),
          isActive: userData.is_active
        };

        // Store authentication data
        TokenManager.setToken(token);
        localStorage.setItem('admin_user', JSON.stringify(user));
        SessionManager.startSession();

        // Update state
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          loading: false,
          error: null
        });

        // Log successful login
        AuditLogger.log('LOGIN_SUCCESS', { userId: user.id });

        return true;
      } else {
        // Handle login failure (backend returns rate limiting info)
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = errorData.error?.message || errorData.message || 'Invalid username or password';

        // Handle different types of errors from backend
        if (response.status === 429) {
          // Rate limiting or IP blocking
          if (errorMessage.includes('blocked') || errorMessage.includes('suspicious activity')) {
            // IP is blocked
            errorMessage = errorMessage;
          } else {
            // Regular rate limiting
            const lockoutSeconds = errorData.lockout_seconds;
            if (lockoutSeconds) {
              const minutes = Math.ceil(lockoutSeconds / 60);
              errorMessage = `Too many login attempts. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`;
            } else {
              errorMessage = errorData.error?.message || errorData.message || 'Rate limit exceeded. Please try again later.';
            }
          }
        } else if (response.status === 401) {
          // Unauthorized - could be invalid credentials or other auth issues
          errorMessage = errorData.error?.message || errorData.message || 'Invalid username or password';
        }

        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage
        }));

        // Log failed login attempt
        AuditLogger.log('LOGIN_FAILED', { username, error: errorMessage, statusCode: response.status });

        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));

      // Log login error
      AuditLogger.log('LOGIN_ERROR', { username, error: errorMessage });

      return false;
    }
  }, []);

  // Logout function using backend API
  const logout = useCallback(async () => {
    const userId = authState.user?.id;
    const token = authState.token;

    try {
      // Call backend logout API
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).catch(err => {/* Logout API call failed - not critical */});
      }
    } catch (error) {
      // Logout error - not critical, continue with local cleanup
    }

    // Clear all authentication data
    TokenManager.clearToken();
    SessionManager.endSession();
    localStorage.removeItem('admin_user');

    // Update state
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null
    });

    // Log logout
    if (userId) {
      AuditLogger.log('LOGOUT', { userId });
    }
  }, [authState.user?.id, authState.token]);

  // Check if current user has required role
  const hasRole = useCallback((requiredRole: 'admin' | 'super_admin'): boolean => {
    if (!authState.isAuthenticated || !authState.user) return false;
    
    if (requiredRole === 'admin') {
      return authState.user.role === 'admin' || authState.user.role === 'super_admin';
    }
    
    return authState.user.role === 'super_admin';
  }, [authState.isAuthenticated, authState.user]);

  // Validate session
  const validateSession = useCallback(async (): Promise<boolean> => {
    if (!authState.isAuthenticated || !authState.token) return false;
    
    if (!TokenManager.isTokenValid() || !SessionManager.isSessionValid()) {
      await logout();
      return false;
    }

    try {
      // Verify token with backend
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        await logout();
        return false;
      }
    } catch (error) {
      await logout();
      return false;
    }
    
    // Update activity
    SessionManager.updateActivity();
    return true;
  }, [authState.isAuthenticated, authState.token, logout]);

  // Clear error
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...authState,
    login,
    logout,
    hasRole,
    validateSession,
    clearError
  };
}; 