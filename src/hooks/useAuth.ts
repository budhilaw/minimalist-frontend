import { useState, useEffect, useCallback } from 'react';
import { AdminUser, LoginCredentials, AuthState } from '../types/admin';
import { TokenManager, PasswordUtils, RateLimiter, SessionManager, AuditLogger } from '../utils/security';

// Demo admin credentials (in production, this would be handled by backend)
const DEMO_ADMIN = {
  id: 'admin-001',
  username: 'admin',
  email: 'ericsson@budhilaw.com',
  role: 'admin' as const,
  // Password: Admin123!
  password: 'Admin123!' // For demo purposes, storing plain text (never do this in production!)
};

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
          const userData = localStorage.getItem('admin_user');
          if (userData) {
            const user: AdminUser = JSON.parse(userData);
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
        }

        // Clear invalid session
        TokenManager.clearToken();
        SessionManager.endSession();
        setAuthState(prev => ({ ...prev, loading: false }));
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState(prev => ({ ...prev, loading: false, error: 'Authentication initialization failed' }));
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    const { username, password } = credentials;
    
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Check rate limiting
      if (RateLimiter.isBlocked(username)) {
        const timeRemaining = RateLimiter.getBlockTimeRemaining(username);
        const minutes = Math.ceil(timeRemaining / (60 * 1000));
        
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: `Too many failed attempts. Please try again in ${minutes} minutes.`
        }));
        
        AuditLogger.log('LOGIN_BLOCKED', { username, timeRemaining });
        return false;
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verify credentials (simplified for demo - in production, use proper hashing)
      const isValidCredentials = username === DEMO_ADMIN.username && password === DEMO_ADMIN.password;
      
      if (isValidCredentials) {
        // Generate session token
        const token = generateSessionToken();
        
        // Create user object
        const user: AdminUser = {
          id: DEMO_ADMIN.id,
          username: DEMO_ADMIN.username,
          email: DEMO_ADMIN.email,
          role: DEMO_ADMIN.role,
          lastLogin: new Date(),
          isActive: true
        };

        // Store authentication data
        TokenManager.setToken(token);
        localStorage.setItem('admin_user', JSON.stringify(user));
        SessionManager.startSession();

        // Clear failed attempts
        RateLimiter.clearAttempts(username);

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
        // Increment failed attempts
        RateLimiter.incrementAttempts(username);
        
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: 'Invalid username or password'
        }));

        // Log failed login attempt
        AuditLogger.log('LOGIN_FAILED', { username });

        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'Login failed. Please try again.'
      }));

      // Log login error
      AuditLogger.log('LOGIN_ERROR', { username, error: error instanceof Error ? error.message : 'Unknown error' });

      return false;
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    const userId = authState.user?.id;
    
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
  const validateSession = useCallback((): boolean => {
    if (!authState.isAuthenticated) return false;
    
    if (!TokenManager.isTokenValid() || !SessionManager.isSessionValid()) {
      logout();
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

  // Helper function to clear rate limiting (for demo purposes)
  const clearRateLimit = useCallback(() => {
    RateLimiter.clearAttempts(DEMO_ADMIN.username);
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...authState,
    login,
    logout,
    hasRole,
    validateSession,
    clearError,
    clearRateLimit
  };
};

// Helper function to generate session token
const generateSessionToken = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2);
  const userAgent = navigator.userAgent;
  
  // Create a simple token (in production, use proper JWT with backend)
  const payload = btoa(JSON.stringify({
    timestamp,
    random,
    userAgent: btoa(userAgent)
  }));
  
  return `admin_${payload}_${timestamp}`;
}; 