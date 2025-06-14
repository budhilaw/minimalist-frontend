import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Icon } from '@iconify/react';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get informational message from location state (e.g., after password change)
  const infoMessage = (location.state as any)?.message;

  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/admin';
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    clearError();
    setIsSubmitting(true);

    try {
      const success = await login(formData);
      
      if (success) {
        const from = (location.state as any)?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      }
    } catch (err) {
      // Error is already handled in useAuth hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  const canSubmit = formData.username && formData.password && !isSubmitting;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[rgb(var(--color-background))] to-[rgb(var(--color-muted))] p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[rgb(var(--color-primary))] text-white rounded-full mb-4">
            <Icon icon="lucide:shield" width={32} height={32} />
          </div>
          <h1 className="text-3xl font-bold text-[rgb(var(--color-foreground))] mb-2">
            Admin Panel
          </h1>
          <p className="text-[rgb(var(--color-muted-foreground))]">
            Secure access to content management
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-[rgb(var(--color-card))] p-8 rounded-lg border border-[rgb(var(--color-border))] shadow-lg">
          {/* Informational Message */}
          {infoMessage && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start">
                <Icon 
                  icon="lucide:info" 
                  width={20} 
                  height={20} 
                  className="text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" 
                />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                    Security Notice
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">{infoMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start">
                <Icon 
                  icon={error.includes('blocked') ? 'lucide:shield-x' : 'lucide:alert-circle'} 
                  width={20} 
                  height={20} 
                  className="text-red-600 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" 
                />
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                    {error.includes('blocked') ? 'Access Blocked' : 'Login Failed'}
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  {error.includes('blocked') && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                      If you believe this is an error, please contact the system administrator.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent transition-colors"
                placeholder="Enter your username"
                required
                disabled={isSubmitting}
                autoComplete="username"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                  required
                  disabled={isSubmitting}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-foreground))] transition-colors"
                  disabled={isSubmitting}
                >
                  {showPassword ? <Icon icon="lucide:eye-off" width={20} height={20} /> : <Icon icon="lucide:eye" width={20} height={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!canSubmit}
              className={`w-full py-3 px-4 rounded-md font-medium transition-all duration-200 ${
                canSubmit
                  ? 'bg-[rgb(var(--color-primary))] text-white hover:bg-[rgb(var(--color-primary))]/90 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:ring-offset-2'
                  : 'bg-[rgb(var(--color-muted))] text-[rgb(var(--color-muted-foreground))] cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Icon icon="lucide:loader2" width={20} height={20} className="animate-spin mr-2" />
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-[rgb(var(--color-border))]">
            <div className="flex items-center text-xs text-[rgb(var(--color-muted-foreground))]">
              <Icon icon="lucide:shield" width={14} height={14} className="mr-2" />
              <span>
                This is a secure admin area. All activities are logged.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-[rgb(var(--color-muted-foreground))]">
            Protected by enterprise-grade security
          </p>
        </div>
      </div>
    </div>
  );
}; 