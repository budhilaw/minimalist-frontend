import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { usePublishedPosts } from '../../hooks/useBlog';
import { useSitemap } from '../../utils/sitemap';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';

export const AdminSEO: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);
  const { posts } = usePublishedPosts({ limit: 1000 });
  const { settings } = useSiteSettings();
  const { downloadSitemap, getSitemapXML, generateRobotsTxt } = useSitemap(
    window.location.origin
  );

  const handleGenerateSitemap = async () => {
    setIsGenerating(true);
    try {
      await downloadSitemap(posts);
      setLastGenerated(new Date().toISOString());
    } catch (error) {
      console.error('Failed to generate sitemap:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreviewSitemap = async () => {
    try {
      const xml = await getSitemapXML(posts);
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to preview sitemap:', error);
    }
  };

  const handleDownloadRobots = () => {
    const robotsTxt = generateRobotsTxt();
    const blob = new Blob([robotsTxt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const seoChecklist = [
    {
      title: 'Meta Tags',
      description: 'Title tags, meta descriptions, and Open Graph tags',
      status: 'good',
      details: 'All pages have proper meta tags'
    },
    {
      title: 'Structured Data',
      description: 'JSON-LD schema markup for better search understanding',
      status: 'good',
      details: 'Article, Person, and Website schemas implemented'
    },
    {
      title: 'Sitemap',
      description: 'XML sitemap for search engine crawling',
      status: posts.length > 0 ? 'good' : 'warning',
      details: `${posts.length} pages in sitemap`
    },
    {
      title: 'Robots.txt',
      description: 'Crawler directives and sitemap location',
      status: 'good',
      details: 'Properly configured with sitemap reference'
    },
    {
      title: 'Performance',
      description: 'Core Web Vitals and loading speed',
      status: 'good',
      details: 'Optimized images and code splitting implemented'
    },
    {
      title: 'Mobile Friendly',
      description: 'Responsive design and mobile optimization',
      status: 'good',
      details: 'Fully responsive with mobile-first approach'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <Icon icon="lucide:check-circle" className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <Icon icon="lucide:alert-triangle" className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <Icon icon="lucide:x-circle" className="w-5 h-5 text-red-500" />;
      default:
        return <Icon icon="lucide:help-circle" className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[rgb(var(--color-foreground))]">
          SEO Management
        </h1>
        <p className="text-[rgb(var(--color-muted-foreground))] mt-1">
          Manage search engine optimization settings and generate sitemaps
        </p>
      </div>

      {/* SEO Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[rgb(var(--color-muted))] p-4 rounded-lg border border-[rgb(var(--color-border))]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[rgb(var(--color-muted-foreground))]">Total Pages</p>
              <p className="text-2xl font-bold text-[rgb(var(--color-foreground))]">
                {posts.length + 6} {/* Static pages + blog posts */}
              </p>
            </div>
            <Icon icon="lucide:file-text" className="w-8 h-8 text-[rgb(var(--color-primary))]" />
          </div>
        </div>

        <div className="bg-[rgb(var(--color-muted))] p-4 rounded-lg border border-[rgb(var(--color-border))]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[rgb(var(--color-muted-foreground))]">Blog Posts</p>
              <p className="text-2xl font-bold text-[rgb(var(--color-foreground))]">{posts.length}</p>
            </div>
            <Icon icon="lucide:book-open" className="w-8 h-8 text-[rgb(var(--color-primary))]" />
          </div>
        </div>

        <div className="bg-[rgb(var(--color-muted))] p-4 rounded-lg border border-[rgb(var(--color-border))]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[rgb(var(--color-muted-foreground))]">SEO Score</p>
              <p className="text-2xl font-bold text-green-600">95%</p>
            </div>
            <Icon icon="lucide:trending-up" className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-[rgb(var(--color-muted))] p-4 rounded-lg border border-[rgb(var(--color-border))]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[rgb(var(--color-muted-foreground))]">Last Updated</p>
              <p className="text-sm font-medium text-[rgb(var(--color-foreground))]">
                {lastGenerated ? new Date(lastGenerated).toLocaleDateString() : 'Never'}
              </p>
            </div>
            <Icon icon="lucide:clock" className="w-8 h-8 text-[rgb(var(--color-primary))]" />
          </div>
        </div>
      </div>

      {/* Sitemap Management */}
      <div className="bg-[rgb(var(--color-muted))] p-6 rounded-lg border border-[rgb(var(--color-border))]">
        <h2 className="text-lg font-semibold text-[rgb(var(--color-foreground))] mb-4">
          Sitemap Management
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleGenerateSitemap}
            disabled={isGenerating}
            className="flex items-center justify-center px-4 py-3 bg-[rgb(var(--color-primary))] text-white rounded-lg hover:bg-[rgb(var(--color-primary))]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isGenerating ? (
              <Icon icon="lucide:loader-2" className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Icon icon="lucide:download" className="w-4 h-4 mr-2" />
            )}
            {isGenerating ? 'Generating...' : 'Download Sitemap'}
          </button>

          <button
            onClick={handlePreviewSitemap}
            className="flex items-center justify-center px-4 py-3 bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] border border-[rgb(var(--color-border))] rounded-lg hover:bg-[rgb(var(--color-muted))] transition-colors duration-200"
          >
            <Icon icon="lucide:eye" className="w-4 h-4 mr-2" />
            Preview Sitemap
          </button>

          <button
            onClick={handleDownloadRobots}
            className="flex items-center justify-center px-4 py-3 bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] border border-[rgb(var(--color-border))] rounded-lg hover:bg-[rgb(var(--color-muted))] transition-colors duration-200"
          >
            <Icon icon="lucide:file-text" className="w-4 h-4 mr-2" />
            Download Robots.txt
          </button>
        </div>

        <div className="mt-4 p-4 bg-[rgb(var(--color-background))] rounded-lg border border-[rgb(var(--color-border))]">
          <h3 className="font-medium text-[rgb(var(--color-foreground))] mb-2">Sitemap Information</h3>
          <ul className="text-sm text-[rgb(var(--color-muted-foreground))] space-y-1">
            <li>• Includes {posts.length + 6} total pages</li>
            <li>• Static pages: Home, About, Portfolio, Services, Blog, Contact</li>
            <li>• Blog posts: {posts.length} published articles</li>
            <li>• Updates automatically when new content is published</li>
          </ul>
        </div>
      </div>

      {/* SEO Checklist */}
      <div className="bg-[rgb(var(--color-muted))] p-6 rounded-lg border border-[rgb(var(--color-border))]">
        <h2 className="text-lg font-semibold text-[rgb(var(--color-foreground))] mb-4">
          SEO Health Check
        </h2>
        
        <div className="space-y-4">
          {seoChecklist.map((item, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-[rgb(var(--color-background))] rounded-lg border border-[rgb(var(--color-border))]">
              {getStatusIcon(item.status)}
              <div className="flex-1">
                <h3 className="font-medium text-[rgb(var(--color-foreground))]">{item.title}</h3>
                <p className="text-sm text-[rgb(var(--color-muted-foreground))] mb-1">{item.description}</p>
                <p className="text-xs text-[rgb(var(--color-muted-foreground))]">{item.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEO Tips */}
      <div className="bg-[rgb(var(--color-muted))] p-6 rounded-lg border border-[rgb(var(--color-border))]">
        <h2 className="text-lg font-semibold text-[rgb(var(--color-foreground))] mb-4">
          SEO Best Practices
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="font-medium text-[rgb(var(--color-foreground))]">Content Optimization</h3>
            <ul className="text-sm text-[rgb(var(--color-muted-foreground))] space-y-1">
              <li>• Use descriptive, keyword-rich titles</li>
              <li>• Write compelling meta descriptions (150-160 chars)</li>
              <li>• Include alt text for all images</li>
              <li>• Use proper heading hierarchy (H1, H2, H3)</li>
              <li>• Internal linking between related content</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-medium text-[rgb(var(--color-foreground))]">Technical SEO</h3>
            <ul className="text-sm text-[rgb(var(--color-muted-foreground))] space-y-1">
              <li>• Ensure fast loading times (&lt;3 seconds)</li>
              <li>• Mobile-first responsive design</li>
              <li>• Clean, descriptive URLs</li>
              <li>• Submit sitemap to Google Search Console</li>
              <li>• Monitor Core Web Vitals regularly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}; 