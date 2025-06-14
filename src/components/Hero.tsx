import React from 'react';
import { Icon } from '@iconify/react';
import { SocialLinks } from './SocialLinks';
import { useSiteSetting } from '../contexts/SiteSettingsContext';

export const Hero: React.FC = () => {
  // Get dynamic settings
  const siteName = useSiteSetting('site.site_name', 'Ericsson Budhilaw');
  const siteDescription = useSiteSetting('site.site_description', 'Full-Stack Software Engineer');
  const socialMediaLinks = useSiteSetting('site.social_media_links', {}) as Record<string, string>;
  const resumeLinks = useSiteSetting('site.files.resume_links', '/Ericsson Budhilaw - CV.pdf') as string;
  
  // Convert social media links to SocialLinks format
  const socialLinks = Object.entries(socialMediaLinks)
    .filter(([_, url]) => url && typeof url === 'string' && url.trim() !== '')
    .map(([id, href]) => ({ id, href: href as string }));

  return (
    <section id="home" className="pt-16 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Content */}
          <div>
            <h1 className="text-4xl tracking-tight font-extrabold text-[rgb(var(--color-foreground))] sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block">{siteName.split(' ')[0] || 'Ericsson'}</span>
              <span className="block text-[rgb(var(--color-primary))]">{siteName.split(' ').slice(1).join(' ') || 'Budhilaw'}</span>
            </h1>
            <p className="mt-6 text-lg text-[rgb(var(--color-muted-foreground))] sm:text-xl lg:text-2xl max-w-3xl mx-auto">
              {siteDescription}
            </p>
            <div className="mt-12 space-y-4 text-[rgb(var(--color-muted-foreground))] max-w-2xl mx-auto">
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
            <div className="mt-12">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))]/90 transition-colors duration-200"
                >
                  Let's Build Something Great
                  <Icon icon="lucide:arrow-right" className="ml-2 -mr-1 w-5 h-5" />
                </a>
                <a
                  href={resumeLinks}
                  className="inline-flex items-center justify-center px-8 py-4 border border-[rgb(var(--color-border))] text-lg font-medium rounded-md text-[rgb(var(--color-foreground))] bg-transparent hover:bg-[rgb(var(--color-muted))] transition-colors duration-200"
                  target="_blank"
                >
                  <Icon icon="lucide:download" className="mr-2 -ml-1 w-5 h-5" />
                  Download Resume
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-12 flex justify-center space-x-6">
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

        {/* Tech Stack Icons */}
        <div className="mt-20">
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