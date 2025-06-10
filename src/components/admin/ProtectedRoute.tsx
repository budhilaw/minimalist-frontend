import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Icon } from '@iconify/react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'super_admin';
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = 'admin',
  redirectTo = '/admin/login'
}) => {
  const { isAuthenticated, loading, user, validateSession, hasRole } = useAuth();
  const location = useLocation();

  // Validate session on route access
  useEffect(() => {
    if (isAuthenticated) {
      validateSession().catch(err => {
        // Session validation failed - handled by useAuth hook
      });
    }
  }, [isAuthenticated, validateSession, location.pathname]);

  // Show loading spinner while authentication is being verified
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--color-background))]">
        <div className="text-center">
          <Icon icon="lucide:loader2" width={48} height={48} className="animate-spin text-[rgb(var(--color-primary))] mx-auto mb-4" />
          <p className="text-[rgb(var(--color-muted-foreground))]">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role permissions
  if (!hasRole(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--color-background))]">
        <div className="max-w-md w-full bg-[rgb(var(--color-card))] p-8 rounded-lg border border-[rgb(var(--color-border))] text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-[rgb(var(--color-foreground))] mb-2">
            Access Denied
          </h1>
          <p className="text-[rgb(var(--color-muted-foreground))] mb-6">
            You don't have permission to access this resource. Required role: {requiredRole}
          </p>
          <p className="text-sm text-[rgb(var(--color-muted-foreground))]">
            Current role: {user.role}
          </p>
        </div>
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
}; 