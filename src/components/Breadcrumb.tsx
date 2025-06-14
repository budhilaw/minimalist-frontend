import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useStructuredData, generateBreadcrumbStructuredData } from '../utils/seo';

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  // Add structured data for breadcrumbs
  useStructuredData(
    generateBreadcrumbStructuredData(
      items.map(item => ({
        name: item.name,
        url: `${window.location.origin}${item.href}`
      }))
    )
  );

  return (
    <nav 
      className={`flex items-center space-x-2 text-sm text-[rgb(var(--color-muted-foreground))] ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <Icon 
                icon="lucide:chevron-right" 
                width={16} 
                height={16} 
                className="mx-2 text-[rgb(var(--color-muted-foreground))]/60" 
              />
            )}
            {index === items.length - 1 ? (
              // Current page - not a link
              <span 
                className="text-[rgb(var(--color-foreground))] font-medium"
                aria-current="page"
              >
                {item.name}
              </span>
            ) : (
              // Link to previous pages
              <Link
                to={item.href}
                className="hover:text-[rgb(var(--color-primary))] transition-colors duration-200"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Hook to generate breadcrumb items based on current route
export const useBreadcrumbs = (pathname: string, postTitle?: string) => {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', href: '/' }
  ];

  const pathSegments = pathname.split('/').filter(Boolean);

  pathSegments.forEach((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    
    switch (segment) {
      case 'blog':
        if (index === pathSegments.length - 1) {
          // Blog listing page
          breadcrumbs.push({ name: 'Blog', href });
        } else {
          // Blog post page
          breadcrumbs.push({ name: 'Blog', href: '/blog' });
          if (postTitle) {
            breadcrumbs.push({ name: postTitle, href });
          }
        }
        break;
      case 'portfolio':
        breadcrumbs.push({ name: 'Portfolio', href });
        break;
      case 'services':
        breadcrumbs.push({ name: 'Services', href });
        break;
      case 'about':
        breadcrumbs.push({ name: 'About', href });
        break;
      case 'contact':
        breadcrumbs.push({ name: 'Contact', href });
        break;
      case 'admin':
        breadcrumbs.push({ name: 'Admin', href });
        break;
      default:
        // Capitalize first letter and replace hyphens with spaces
        const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
        breadcrumbs.push({ name, href });
    }
  });

  return breadcrumbs;
}; 