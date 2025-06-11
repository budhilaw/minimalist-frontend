import React from 'react';
import { Icon } from '@iconify/react';
import { SocialLinks } from './SocialLinks';
import { useSiteSetting } from '../contexts/SiteSettingsContext';

export const Hero: React.FC = () => {
  // Get dynamic settings
  const siteName = useSiteSetting('site.site_name', 'Ericsson Budhilaw');
  const siteDescription = useSiteSetting('site.site_description', 'Full-Stack Software Engineer');
  const socialMediaLinks = useSiteSetting('site.social_media_links', {}) as Record<string, string>;
  
  // Convert social media links to SocialLinks format
  const socialLinks = Object.entries(socialMediaLinks)
    .filter(([_, url]) => url && typeof url === 'string' && url.trim() !== '')
    .map(([id, href]) => ({ id, href: href as string }));

  return (
    <section id="home" className="pt-16 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Content */}
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:items-center">
            <div>
              <h1 className="text-4xl tracking-tight font-extrabold text-[rgb(var(--color-foreground))] sm:text-5xl md:text-6xl">
                <span className="block">{siteName.split(' ')[0] || 'Ericsson'}</span>
                <span className="block text-[rgb(var(--color-primary))]">{siteName.split(' ').slice(1).join(' ') || 'Budhilaw'}</span>
              </h1>
              <p className="mt-3 text-base text-[rgb(var(--color-muted-foreground))] sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                {siteDescription}
              </p>
              <div className="mt-8 space-y-4 text-[rgb(var(--color-muted-foreground))]">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-[rgb(var(--color-accent))] rounded-full mr-3"></span>
                  6+ Years of Professional Full-Stack Development Excellence
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-[rgb(var(--color-accent))] rounded-full mr-3"></span>
                  Backend Expert: Go, JavaScript, Rust, Python, PHP
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-[rgb(var(--color-accent))] rounded-full mr-3"></span>
                  Frontend Specialist: ReactJS, VueJS, NextJS
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-[rgb(var(--color-accent))] rounded-full mr-3"></span>
                  Cloud Infrastructure Experience (AWS & GCP)
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-[rgb(var(--color-accent))] rounded-full mr-3"></span>
                  Web3 Developer & AI Engineering Enthusiast
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))]/90 transition-colors duration-200"
                  >
                    Let's Build Something Great
                    <Icon icon="lucide:arrow-right" className="ml-2 -mr-1 w-5 h-5" />
                  </a>
                  <a
                    href="/Ericsson Budhilaw - CV.pdf"
                    className="inline-flex items-center justify-center px-6 py-3 border border-[rgb(var(--color-border))] text-base font-medium rounded-md text-[rgb(var(--color-foreground))] bg-transparent hover:bg-[rgb(var(--color-muted))] transition-colors duration-200"
                  >
                    <Icon icon="lucide:download" className="mr-2 -ml-1 w-5 h-5" />
                    Download Resume
                  </a>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8 flex justify-center lg:justify-start space-x-6">
                {socialLinks.length > 0 && (
                  <SocialLinks 
                    links={socialLinks} 
                    size={24} 
                    className="space-x-6" 
                  />
                )}
              </div>
            </div>
          </div>

          {/* Professional Image */}
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            <div className="relative mx-auto w-full rounded-lg lg:max-w-md">
              <div className="relative bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] rounded-lg p-1">
                <div className="w-full h-96 bg-[rgb(var(--color-muted))] rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-[rgb(var(--color-border))] rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-4xl text-[rgb(var(--color-muted-foreground))]">👨‍💻</span>
                    </div>
                    <p className="text-[rgb(var(--color-muted-foreground))] text-sm">
                      {siteName}
                    </p>
                    <p className="text-[rgb(var(--color-muted-foreground))] text-xs mt-1">
                      {siteDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Icons */}
        <div className="mt-16">
          <p className="text-center text-sm font-medium text-[rgb(var(--color-muted-foreground))] uppercase tracking-wider">
            Full-Stack Technologies & Platforms
          </p>
          <div className="mt-6 flex flex-wrap justify-center items-center gap-3 sm:gap-4 opacity-60">
            {['ReactJS', 'VueJS', 'NextJS', 'Go', 'JavaScript', 'Rust', 'Python', 'PHP'].map((tech) => (
              <div
                key={tech}
                className="bg-[rgb(var(--color-muted))] px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-[rgb(var(--color-foreground))]"
              >
                {tech}
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap justify-center items-center gap-3 sm:gap-4 opacity-50">
            {['AWS', 'GCP', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB'].map((tech) => (
              <div
                key={tech}
                className="bg-[rgb(var(--color-muted))] px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-[rgb(var(--color-foreground))]"
              >
                {tech}
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap justify-center items-center gap-3 sm:gap-4 opacity-40">
            {['Web3', 'Blockchain', 'AI/ML', 'WordPress'].map((tech) => (
              <div
                key={tech}
                className="bg-[rgb(var(--color-muted))] px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-[rgb(var(--color-foreground))]"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}; 