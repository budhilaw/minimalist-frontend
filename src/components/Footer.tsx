import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Twitter, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
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

  const quickLinks = [
    { name: 'Home', href: '/', isRoute: true },
    { name: 'About', href: '/#about', isRoute: false },
    { name: 'Services', href: '/#services', isRoute: false },
    { name: 'Blog', href: '/blog', isRoute: true },
    { name: 'Contact', href: '/#contact', isRoute: false }
  ];

  return (
    <footer className="bg-[rgb(var(--color-muted))] border-t border-[rgb(var(--color-border))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
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

          {/* Quick Links */}
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
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center text-[rgb(var(--color-muted-foreground))] text-sm">
              <span>© {currentYear} John Doe. Made with</span>
              <Heart size={16} className="mx-1 text-red-500" />
              <span>and React + TypeScript</span>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-6 text-sm text-[rgb(var(--color-muted-foreground))]">
              <a
                href="/privacy"
                className="hover:text-[rgb(var(--color-primary))] transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="hover:text-[rgb(var(--color-primary))] transition-colors duration-200"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}; 