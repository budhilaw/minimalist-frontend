import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { RateLimiter } from '../../utils/security';
import { Shield, Eye, EyeOff, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading, error, clearError, clearRateLimit } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);

  // Check rate limiting status
  useEffect(() => {
    const checkRateLimit = () => {
      const currentAttempts = RateLimiter.getAttempts(formData.username || 'default');
      const timeRemaining = RateLimiter.getBlockTimeRemaining(formData.username || 'default');
      
      setAttempts(currentAttempts);
      setBlockTimeRemaining(timeRemaining);
    };

    checkRateLimit();
    const interval = setInterval(checkRateLimit, 1000);
    return () => clearInterval(interval);
  }, [formData.username]);

  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/admin';
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting || blockTimeRemaining > 0) return;
    
    clearError();
    setIsSubmitting(true);

    try {
      const success = await login(formData);
      
      if (success) {
        const from = (location.state as any)?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
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

  const handleClearRateLimit = () => {
    clearRateLimit();
    setAttempts(0);
    setBlockTimeRemaining(0);
  };

  const isBlocked = blockTimeRemaining > 0;
  const canSubmit = formData.username && formData.password && !isSubmitting && !isBlocked;

  const formatTimeRemaining = (ms: number): string => {
    const minutes = Math.floor(ms / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[rgb(var(--color-background))] to-[rgb(var(--color-muted))] p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[rgb(var(--color-primary))] text-white rounded-full mb-4">
            <Shield size={32} />
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
          {/* Demo Credentials Info */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              Demo Credentials
            </h3>
            <div className="text-xs text-blue-600 dark:text-blue-300 space-y-1">
              <p><strong>Username:</strong> admin</p>
              <p><strong>Password:</strong> Admin123!</p>
            </div>
          </div>

          {/* Rate Limiting Warning */}
          {attempts > 0 && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle size={16} className="text-yellow-600 dark:text-yellow-400 mr-2" />
                  <div>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Failed attempts: {attempts}/5
                    </p>
                    {isBlocked && (
                      <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                        Account locked for: {formatTimeRemaining(blockTimeRemaining)}
                      </p>
                    )}
                  </div>
                </div>
                {isBlocked && (
                  <button
                    onClick={handleClearRateLimit}
                    className="flex items-center px-3 py-1 text-xs bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                    title="Clear rate limiting (Demo only)"
                  >
                    <RefreshCw size={12} className="mr-1" />
                    Reset
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
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
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                  <Loader2 size={20} className="animate-spin mr-2" />
                  Signing in...
                </div>
              ) : isBlocked ? (
                `Locked (${formatTimeRemaining(blockTimeRemaining)})`
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-[rgb(var(--color-border))]">
            <div className="flex items-center text-xs text-[rgb(var(--color-muted-foreground))]">
              <Shield size={14} className="mr-2" />
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