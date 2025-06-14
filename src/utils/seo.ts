// SEO utilities for managing document title, meta tags, and other SEO elements

import { useEffect } from 'react';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

// Enhanced document title hook that supports admin-configurable titles
export const useDocumentTitle = (pageTitle?: string, pageDescription?: string) => {
  const { settings } = useSiteSettings();
  
  useEffect(() => {
    // Get configured titles from admin settings
    const configuredTitle = settings?.site?.page_title;
    const configuredDescription = settings?.site?.page_description;
    
    // Use priority: pageTitle > configuredTitle > fallback
    const title = pageTitle || configuredTitle || 'Ericsson Budhilaw - Senior Software Engineer | Full-Stack Development';
    const description = pageDescription || configuredDescription || 'Senior Software Engineer specializing in full-stack development, consulting, and freelancing.';
    
    // Update document title
    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    // Update Open Graph title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const configuredOgTitle = settings?.site?.og_title;
    if (ogTitle) {
      ogTitle.setAttribute('content', configuredOgTitle || title);
    }
    
    // Update Open Graph description
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const configuredOgDescription = settings?.site?.og_description;
    if (ogDescription) {
      ogDescription.setAttribute('content', configuredOgDescription || description);
    }
    
    // Update Twitter title
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const configuredTwitterTitle = settings?.site?.twitter_title;
    if (twitterTitle) {
      twitterTitle.setAttribute('content', configuredTwitterTitle || title);
    }
    
    // Update Twitter description
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    const configuredTwitterDescription = settings?.site?.twitter_description;
    if (twitterDescription) {
      twitterDescription.setAttribute('content', configuredTwitterDescription || description);
    }
    
  }, [pageTitle, pageDescription, settings]);
};

// Social media meta tags hook with admin settings support
export const useSocialMeta = ({ 
  title, 
  description, 
  type = 'website', 
  image 
}: {
  title?: string;
  description?: string;
  type?: string;
  image?: string;
}) => {
  const { settings } = useSiteSettings();
  
  useEffect(() => {
    // Get configured meta from admin settings
    const configuredTitle = settings?.site?.page_title;
    const configuredDescription = settings?.site?.page_description;
    const configuredOgTitle = settings?.site?.og_title;
    const configuredOgDescription = settings?.site?.og_description;
    const configuredTwitterTitle = settings?.site?.twitter_title;
    const configuredTwitterDescription = settings?.site?.twitter_description;
    
    // Use priority: provided > configured > fallback
    const finalTitle = title || configuredTitle || 'Ericsson Budhilaw - Senior Software Engineer';
    const finalDescription = description || configuredDescription || 'Senior Software Engineer specializing in full-stack development, consulting, and freelancing.';
    
    // Update Open Graph meta tags
    const ogTitleElement = document.querySelector('meta[property="og:title"]');
    if (ogTitleElement) {
      ogTitleElement.setAttribute('content', configuredOgTitle || finalTitle);
    }
    
    const ogDescElement = document.querySelector('meta[property="og:description"]');
    if (ogDescElement) {
      ogDescElement.setAttribute('content', configuredOgDescription || finalDescription);
    }
    
    const ogTypeElement = document.querySelector('meta[property="og:type"]');
    if (ogTypeElement) {
      ogTypeElement.setAttribute('content', type);
    }
    
    // Update Twitter meta tags
    const twitterTitleElement = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitleElement) {
      twitterTitleElement.setAttribute('content', configuredTwitterTitle || finalTitle);
    }
    
    const twitterDescElement = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescElement) {
      twitterDescElement.setAttribute('content', configuredTwitterDescription || finalDescription);
    }
    
    // Update image if provided
    if (image) {
      const ogImageElement = document.querySelector('meta[property="og:image"]');
      if (ogImageElement) {
        ogImageElement.setAttribute('content', image);
      }
      
      const twitterImageElement = document.querySelector('meta[name="twitter:image"]');
      if (twitterImageElement) {
        twitterImageElement.setAttribute('content', image);
      }
    }
    
  }, [title, description, type, image, settings]);
};

// Hook for setting structured data (JSON-LD)
export const useStructuredData = (data: object) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    script.id = 'structured-data';
    
    // Remove existing structured data
    const existing = document.getElementById('structured-data');
    if (existing) {
      existing.remove();
    }
    
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById('structured-data');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [data]);
};

// Utility function to generate article structured data
export const generateArticleStructuredData = (article: {
  title: string;
  description: string;
  author: string;
  publishedDate: string;
  modifiedDate?: string;
  image?: string;
  url: string;
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    datePublished: article.publishedDate,
    dateModified: article.modifiedDate || article.publishedDate,
    image: article.image,
    url: article.url,
    publisher: {
      '@type': 'Organization',
      name: 'Ericsson Budhilaw',
      logo: {
        '@type': 'ImageObject',
        url: '/logo.png', // Add your logo URL
      },
    },
  };
};

// Utility function to generate website structured data
export const generateWebsiteStructuredData = (site: {
  name: string;
  description: string;
  url: string;
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    description: site.description,
    url: site.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${site.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
};

// Utility function to generate person structured data
export const generatePersonStructuredData = (person: {
  name: string;
  jobTitle: string;
  description: string;
  url: string;
  image?: string;
  sameAs?: string[];
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    jobTitle: person.jobTitle,
    description: person.description,
    url: person.url,
    image: person.image,
    sameAs: person.sameAs,
  };
};

// Utility function to generate breadcrumb structured data
export const generateBreadcrumbStructuredData = (breadcrumbs: Array<{
  name: string;
  url: string;
}>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
};

// Utility function to generate service structured data
export const generateServiceStructuredData = (service: {
  name: string;
  description: string;
  provider: string;
  areaServed?: string;
  serviceType?: string;
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Person',
      name: service.provider,
    },
    areaServed: service.areaServed || 'Worldwide',
    serviceType: service.serviceType || 'Software Development',
  };
};

// Utility function to generate FAQ structured data
export const generateFAQStructuredData = (faqs: Array<{
  question: string;
  answer: string;
}>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
};

// Utility function to generate organization structured data
export const generateOrganizationStructuredData = (org: {
  name: string;
  description: string;
  url: string;
  logo?: string;
  contactPoint?: {
    telephone?: string;
    email?: string;
    contactType?: string;
  };
  sameAs?: string[];
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    description: org.description,
    url: org.url,
    logo: org.logo,
    contactPoint: org.contactPoint ? {
      '@type': 'ContactPoint',
      telephone: org.contactPoint.telephone,
      email: org.contactPoint.email,
      contactType: org.contactPoint.contactType || 'customer service',
    } : undefined,
    sameAs: org.sameAs,
  };
}; 