// Sitemap generation utilities for SEO

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export class SitemapGenerator {
  private baseUrl: string;
  private urls: SitemapUrl[] = [];

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  addUrl(url: SitemapUrl): void {
    this.urls.push({
      ...url,
      loc: url.loc.startsWith('http') ? url.loc : `${this.baseUrl}${url.loc}`
    });
  }

  addStaticPages(): void {
    const staticPages: SitemapUrl[] = [
      {
        loc: '/',
        changefreq: 'weekly',
        priority: 1.0,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/about',
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/portfolio',
        changefreq: 'weekly',
        priority: 0.9,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/services',
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/blog',
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/contact',
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: new Date().toISOString().split('T')[0]
      }
    ];

    staticPages.forEach(page => this.addUrl(page));
  }

  addBlogPosts(posts: Array<{ slug: string; updated_at?: string; created_at: string }>): void {
    posts.forEach(post => {
      this.addUrl({
        loc: `/blog/${post.slug}`,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: (post.updated_at || post.created_at).split('T')[0]
      });
    });
  }

  generateXML(): string {
    const urlElements = this.urls.map(url => {
      let urlElement = `  <url>\n    <loc>${this.escapeXml(url.loc)}</loc>\n`;
      
      if (url.lastmod) {
        urlElement += `    <lastmod>${url.lastmod}</lastmod>\n`;
      }
      
      if (url.changefreq) {
        urlElement += `    <changefreq>${url.changefreq}</changefreq>\n`;
      }
      
      if (url.priority !== undefined) {
        urlElement += `    <priority>${url.priority.toFixed(1)}</priority>\n`;
      }
      
      urlElement += '  </url>';
      return urlElement;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
  }

  private escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case "'": return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  }

  downloadSitemap(filename: string = 'sitemap.xml'): void {
    const xml = this.generateXML();
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Utility function to generate robots.txt content
export const generateRobotsTxt = (sitemapUrl: string): string => {
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${sitemapUrl}

# Crawl-delay for polite crawling
Crawl-delay: 1

# Disallow admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /static/

# Allow specific important paths
Allow: /blog/
Allow: /portfolio/
Allow: /services/
Allow: /about/
Allow: /contact/`;
};

// Hook for generating and managing sitemap
export const useSitemap = (baseUrl: string) => {
  const generateSitemap = async (posts?: Array<{ slug: string; updated_at?: string; created_at: string }>) => {
    const sitemap = new SitemapGenerator(baseUrl);
    
    // Add static pages
    sitemap.addStaticPages();
    
    // Add blog posts if provided
    if (posts && posts.length > 0) {
      sitemap.addBlogPosts(posts);
    }
    
    return sitemap;
  };

  const downloadSitemap = async (posts?: Array<{ slug: string; updated_at?: string; created_at: string }>) => {
    const sitemap = await generateSitemap(posts);
    sitemap.downloadSitemap();
  };

  const getSitemapXML = async (posts?: Array<{ slug: string; updated_at?: string; created_at: string }>) => {
    const sitemap = await generateSitemap(posts);
    return sitemap.generateXML();
  };

  return {
    generateSitemap,
    downloadSitemap,
    getSitemapXML,
    generateRobotsTxt: () => generateRobotsTxt(`${baseUrl}/sitemap.xml`)
  };
}; 