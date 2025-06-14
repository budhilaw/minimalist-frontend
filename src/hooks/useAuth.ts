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

  // Cross-tab synchronization using storage events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Handle logout from another tab
      if (e.key === 'admin_user' && e.newValue === null && e.oldValue !== null) {
        // User was logged out in another tab
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null
        });
        return;
      }

      // Handle login from another tab
      if (e.key === 'admin_user' && e.newValue !== null && e.oldValue === null) {
        try {
          const user = JSON.parse(e.newValue);
          if (SessionManager.isSessionValid()) {
            setAuthState({
              user,
              token: 'httpOnly',
              isAuthenticated: true,
              loading: false,
              error: null
            });
          }
        } catch (error) {
          console.error('Failed to parse user data from storage event:', error);
        }
        return;
      }

      // Handle session invalidation
      if (e.key === 'admin_session_id' && e.newValue === null && e.oldValue !== null) {
        // Session was ended in another tab
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null
        });
        return;
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Initialize auth state from httpOnly cookies
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have a stored user (for session restoration)
        const storedUser = localStorage.getItem('admin_user');
        
        if (storedUser && SessionManager.isSessionValid()) {
          // Parse stored user first
          let user: AdminUser;
          try {
            const userData = JSON.parse(storedUser);
            user = {
              id: userData.id,
              username: userData.username,
              email: userData.email,
              full_name: userData.full_name,
              phone: userData.phone,
              role: userData.role as 'admin' | 'super_admin',
              lastLogin: new Date(userData.lastLogin || Date.now()),
              isActive: userData.isActive
            };
          } catch (parseError) {
            console.error('Failed to parse stored user data:', parseError);
            localStorage.removeItem('admin_user');
            SessionManager.endSession();
            setAuthState(prev => ({ ...prev, loading: false }));
            return;
          }

          // Try to verify session with backend using httpOnly cookies
          // But don't clear localStorage if this fails - it might be a network issue
          try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
              method: 'GET',
              credentials: 'include', // Include httpOnly cookies
              headers: {
                'Content-Type': 'application/json'
              }
            });

            if (response.ok) {
              const data = await response.json();
              const backendUser: AdminUser = {
                id: data.data.user.id,
                username: data.data.user.username,
                email: data.data.user.email,
                full_name: data.data.user.full_name,
                phone: data.data.user.phone,
                role: data.data.user.role as 'admin' | 'super_admin',
                lastLogin: new Date(data.data.user.last_login || Date.now()),
                isActive: data.data.user.is_active
              };

              setAuthState({
                user: backendUser,
                token: 'httpOnly', // Placeholder since we can't access the actual token
                isAuthenticated: true,
                loading: false,
                error: null
              });
              
              // Update stored user data with fresh data from backend
              localStorage.setItem('admin_user', JSON.stringify(backendUser));
              
              // Log successful session restoration
              AuditLogger.log('SESSION_RESTORED', { userId: backendUser.id });
              return;
            } else if (response.status === 401 || response.status === 403) {
              // Only clear localStorage if we get a definitive authentication error
              console.log('Session verification failed with auth error:', response.status);
              localStorage.removeItem('admin_user');
              SessionManager.endSession();
              setAuthState(prev => ({ ...prev, loading: false }));
              return;
            } else {
              // For other errors (network, server errors), assume user is still logged in
              // but we can't verify right now
              console.warn('Session verification failed with non-auth error:', response.status);
              setAuthState({
                user,
                token: 'httpOnly',
                isAuthenticated: true,
                loading: false,
                error: null
              });
              return;
            }
          } catch (error) {
            // Network error or other issues - don't clear localStorage
            // Assume user is still logged in but we can't verify right now
            console.warn('Session verification failed due to network error:', error);
            setAuthState({
              user,
              token: 'httpOnly',
              isAuthenticated: true,
              loading: false,
              error: null
            });
            return;
          }
        }

        // No stored user or session is invalid
        setAuthState(prev => ({ ...prev, loading: false }));
      } catch (error) {
        console.error('Authentication initialization failed:', error);
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
        credentials: 'include', // Include cookies for httpOnly token storage
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        const { user: userData } = data.data;

        // Create user object
        const user: AdminUser = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          full_name: userData.full_name,
          phone: userData.phone,
          role: userData.role as 'admin' | 'super_admin',
          lastLogin: new Date(userData.last_login || Date.now()),
          isActive: userData.is_active
        };

        // Store user data (token is now in httpOnly cookie)
        localStorage.setItem('admin_user', JSON.stringify(user));
        SessionManager.startSession();

        // Update state
        setAuthState({
          user,
          token: 'httpOnly', // Placeholder since we can't access the actual token
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

    try {
      // Call backend logout API (httpOnly cookies will be cleared by backend)
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
        credentials: 'include', // Include httpOnly cookies
          headers: {
            'Content-Type': 'application/json'
          }
        }).catch(err => {/* Logout API call failed - not critical */});
    } catch (error) {
      // Logout error - not critical, continue with local cleanup
    }

    // Clear all local authentication data
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
  }, [authState.user?.id]);

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
    if (!authState.isAuthenticated) return false;
    
    if (!SessionManager.isSessionValid()) {
      await logout();
      return false;
    }

    try {
      // Verify session with backend using httpOnly cookies
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include', // Include httpOnly cookies
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        // Only logout if we're sure the session is invalid
        // Don't logout on network errors or temporary issues
        if (response.status === 401 || response.status === 403) {
          await logout();
        }
        return false;
      }
    } catch (error) {
      // Network error - don't logout, just return false
      console.warn('Session validation failed due to network error:', error);
      return false;
    }
    
    // Update activity
    SessionManager.updateActivity();
    return true;
  }, [authState.isAuthenticated, logout]);

  // Clear error
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  // Update user data
  const updateUser = useCallback((updatedUser: any) => {
    const user: AdminUser = {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      full_name: updatedUser.full_name,
      phone: updatedUser.phone,
      role: updatedUser.role as 'admin' | 'super_admin',
      lastLogin: new Date(updatedUser.last_login || Date.now()),
      isActive: updatedUser.is_active
    };

    setAuthState(prev => ({
      ...prev,
      user
    }));

    // Update stored user data
    localStorage.setItem('admin_user', JSON.stringify(user));
  }, []);

  return {
    ...authState,
    login,
    logout,
    hasRole,
    validateSession,
    clearError,
    updateUser
  };
}; 