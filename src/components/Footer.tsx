import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Twitter, Heart } from 'lucide-react';
import { useContentAvailability } from '../hooks/useContentAvailability';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { hasPortfolio, hasServices, hasPosts, loading } = useContentAvailability();
  
  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com',
      icon: Github
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: Linkedin
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com',
      icon: Twitter
    },
    {
      name: 'Email',
      href: 'mailto:john@example.com',
      icon: Mail
    }
  ];

  // Build quick links array based on available content
  const allQuickLinks = [
    { name: 'Home', href: '/', isRoute: true, condition: true },
    { name: 'About', href: '/#about', isRoute: false, condition: true },
    { name: 'Portfolio', href: '/#portfolio', isRoute: false, condition: hasPortfolio },
    { name: 'Services', href: '/#services', isRoute: false, condition: hasServices },
    { name: 'Blog', href: '/blog', isRoute: true, condition: hasPosts },
    { name: 'Contact', href: '/#contact', isRoute: false, condition: true }
  ];

  // Filter quick links based on content availability (when not loading)
  const quickLinks = loading ? allQuickLinks : allQuickLinks.filter(link => link.condition);
  
  // Check if we should show Quick Links section at all
  const hasAnyContent = hasPortfolio || hasServices || hasPosts;
  const showQuickLinks = loading || hasAnyContent;

  return (
    <footer className="bg-[rgb(var(--color-muted))] border-t border-[rgb(var(--color-border))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`lg:grid lg:gap-8 ${showQuickLinks ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
          {/* Brand Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-[rgb(var(--color-primary))]">
                John Doe
              </h3>
              <p className="text-[rgb(var(--color-muted-foreground))] mt-2">
                Senior Software Engineer
              </p>
            </div>
            <p className="text-[rgb(var(--color-muted-foreground))] leading-relaxed">
              Turning complex problems into elegant solutions. Building scalable web applications 
              and helping teams deliver exceptional software.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-primary))] transition-colors duration-200"
                    aria-label={link.name}
                  >
                    <IconComponent size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links - Only show if there's content available */}
          {showQuickLinks && (
            <div className="mt-8 lg:mt-0">
              <h4 className="text-lg font-semibold text-[rgb(var(--color-foreground))] mb-4">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    {link.isRoute ? (
                      <Link
                        to={link.href}
                        className="text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-primary))] transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-primary))] transition-colors duration-200"
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact Info */}
          <div className="mt-8 lg:mt-0">
            <h4 className="text-lg font-semibold text-[rgb(var(--color-foreground))] mb-4">
              Get In Touch
            </h4>
            <div className="space-y-3">
              <p className="text-[rgb(var(--color-muted-foreground))]">
                <span className="font-medium">Email:</span> john@example.com
              </p>
              <p className="text-[rgb(var(--color-muted-foreground))]">
                <span className="font-medium">Location:</span> San Francisco, CA
              </p>
              <p className="text-[rgb(var(--color-muted-foreground))]">
                <span className="font-medium">Availability:</span> Open for new projects
              </p>
            </div>
            <div className="mt-4">
              <a
                href="#contact"
                className="inline-flex items-center px-4 py-2 border border-[rgb(var(--color-primary))] text-sm font-medium rounded-md text-[rgb(var(--color-primary))] bg-transparent hover:bg-[rgb(var(--color-primary))] hover:text-white transition-colors duration-200"
              >
                Start a Project
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-[rgb(var(--color-border))]">
          <div className="flex justify-center items-center">
            <div className="flex items-center text-[rgb(var(--color-muted-foreground))] text-sm">
              <span>© {currentYear} John Doe. Made with</span>
              <Heart size={16} className="mx-1 text-red-500" />
              <span>and React + TypeScript</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}; 