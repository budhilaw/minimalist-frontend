import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSiteSetting } from '../contexts/SiteSettingsContext';

interface FeatureRouteProps {
  children: React.ReactNode;
  feature: 'portfolio_enabled' | 'services_enabled' | 'blog_enabled';
  redirectTo?: string;
}

export const FeatureRoute: React.FC<FeatureRouteProps> = ({ 
  children, 
  feature, 
  redirectTo = '/' 
}) => {
  const isEnabled = useSiteSetting(`features.${feature}`, true);

  if (!isEnabled) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}; 