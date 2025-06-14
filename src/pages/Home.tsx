import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Hero } from '../components/Hero';
import { Blog } from '../components/Blog';
import { useDocumentTitle, useSocialMeta, useStructuredData, generateWebsiteStructuredData, generatePersonStructuredData } from '../utils/seo';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

export const Home: React.FC = () => {
  const { settings } = useSiteSettings();

  // SEO: Set default page title structure "Site Title | Site Description"
  useDocumentTitle(); // No pageTitle provided, so it will use default structure

  // SEO: Set social media meta tags for homepage
  useSocialMeta({
    title: settings?.site.site_name,
    description: settings?.site.site_description,
    image: settings?.site.photo_profile,
    url: window.location.origin,
    type: 'website'
  });

  // SEO: Add structured data for website and person
  useStructuredData({
    '@context': 'https://schema.org',
    '@graph': [
      // Website structured data
      generateWebsiteStructuredData({
        name: settings?.site.site_name || 'Ericsson Budhilaw',
        description: settings?.site.site_description || 'Senior Software Engineer',
        url: window.location.origin
      }),
      // Person structured data
      generatePersonStructuredData({
        name: 'Ericsson Budhilaw',
        jobTitle: 'Senior Software Engineer',
        description: 'Full-stack software engineer with 6+ years of experience in web development, specializing in React, Go, Rust, and cloud solutions.',
        url: window.location.origin,
        image: settings?.site.photo_profile,
        sameAs: [
          settings?.site.social_media_links.github,
          settings?.site.social_media_links.linkedin,
          settings?.site.social_media_links.x,
        ].filter(Boolean) as string[]
      })
    ]
  });

  return (
    <>
      {/* Hero Section */}
      <Hero />
      
      {/* About Me Preview Section */}
      <section className="py-20 bg-[rgb(var(--color-muted))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            {/* Professional Photo */}
            <div className="mb-8 lg:mb-0">
              <div className="relative">
                <img
                  src="/me.jpg"
                  alt="Ericsson Budhilaw - Full-Stack Software Engineer"
                  className="w-full max-w-md mx-auto rounded-2xl shadow-2xl object-cover aspect-[3/4]"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>
            </div>
            
            {/* About Content */}
            <div>
              <h2 className="text-3xl font-extrabold text-[rgb(var(--color-foreground))] sm:text-4xl mb-6">
                About Me
              </h2>
              <div className="space-y-4 text-[rgb(var(--color-muted-foreground))] text-lg">
                <p>
                  I'm Ericsson Budhilaw, a seasoned full-stack software engineer with over 6 years of professional experience 
                  delivering high-performance, end-to-end software solutions.
                </p>
                <p>
                  My expertise spans the complete development stack - from crafting intuitive user interfaces with ReactJS, 
                  VueJS, and NextJS on the frontend, to building robust backend systems using Go, JavaScript, Rust, Python, and PHP.
                </p>
                <p>
                  Currently expanding my horizons in emerging technologies, I'm actively building Web3 applications 
                  and diving deep into AI engineering.
                </p>
              </div>
              
              {/* Key Skills */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-[rgb(var(--color-foreground))] mb-3">
                  Core Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['ReactJS', 'VueJS', 'NextJS', 'Go', 'Rust', 'Python', 'JavaScript', 'TypeScript'].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] text-sm rounded-full border border-[rgb(var(--color-border))]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-8">
                <Link
                  to="/about"
                  className="inline-flex items-center px-6 py-3 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] font-medium rounded-lg hover:bg-[rgb(var(--color-primary))]/90 transition-colors duration-200"
                >
                  Learn More About Me
                  <Icon icon="lucide:arrow-right" className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Preview Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[rgb(var(--color-foreground))] sm:text-4xl mb-4">
              Featured Projects
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-[rgb(var(--color-muted-foreground))]">
              A showcase of my recent work in full-stack development, from enterprise applications to innovative solutions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Project Preview Cards */}
            {[
              {
                title: "E-commerce Platform",
                description: "Full-stack e-commerce solution with React, Node.js, and PostgreSQL",
                technologies: ["React", "Node.js", "PostgreSQL", "Stripe"]
              },
              {
                title: "Task Management API",
                description: "RESTful API for team collaboration with JWT authentication",
                technologies: ["Rust", "Axum", "PostgreSQL", "Redis"]
              },
              {
                title: "Real-time Dashboard",
                description: "Analytics dashboard with live data visualization",
                technologies: ["Vue.js", "Go", "WebSocket", "Chart.js"]
              }
            ].map((project, index) => (
              <div key={index} className="bg-[rgb(var(--color-muted))] p-6 rounded-lg border border-[rgb(var(--color-border))]">
                <h3 className="text-xl font-semibold text-[rgb(var(--color-foreground))] mb-3">
                  {project.title}
                </h3>
                <p className="text-[rgb(var(--color-muted-foreground))] mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] text-xs rounded border border-[rgb(var(--color-border))]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link
              to="/portfolio"
              className="inline-flex items-center px-6 py-3 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] font-medium rounded-lg hover:bg-[rgb(var(--color-primary))]/90 transition-colors duration-200"
            >
              View All Projects
              <Icon icon="lucide:arrow-right" className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-20 bg-[rgb(var(--color-muted))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[rgb(var(--color-foreground))] sm:text-4xl mb-4">
              What I Offer
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-[rgb(var(--color-muted-foreground))]">
              Professional development services to bring your ideas to life
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: "lucide:code",
                title: "Full-Stack Development",
                description: "Complete web applications from frontend to backend with modern technologies"
              },
              {
                icon: "lucide:server",
                title: "API Development",
                description: "Robust RESTful APIs and microservices architecture for scalable solutions"
              },
              {
                icon: "lucide:cloud",
                title: "Cloud Solutions",
                description: "Deployment and infrastructure management on AWS and GCP platforms"
              }
            ].map((service, index) => (
              <div key={index} className="bg-[rgb(var(--color-background))] p-6 rounded-lg border border-[rgb(var(--color-border))] text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-[rgb(var(--color-primary))] rounded-lg flex items-center justify-center">
                    <Icon icon={service.icon} className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-[rgb(var(--color-foreground))] mb-3">
                  {service.title}
                </h3>
                <p className="text-[rgb(var(--color-muted-foreground))]">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link
              to="/services"
              className="inline-flex items-center px-6 py-3 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] font-medium rounded-lg hover:bg-[rgb(var(--color-primary))]/90 transition-colors duration-200"
            >
              View All Services
              <Icon icon="lucide:arrow-right" className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <Blog />

      {/* Contact CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-[rgb(var(--color-foreground))] sm:text-4xl mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-[rgb(var(--color-muted-foreground))] mb-8">
            Let's discuss how I can help bring your ideas to life with modern, scalable solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-3 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] font-medium rounded-lg hover:bg-[rgb(var(--color-primary))]/90 transition-colors duration-200"
            >
              Get In Touch
              <Icon icon="lucide:mail" className="ml-2 w-4 h-4" />
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex items-center px-8 py-3 border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] font-medium rounded-lg hover:bg-[rgb(var(--color-muted))] transition-colors duration-200"
            >
              View My Work
              <Icon icon="lucide:eye" className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}; 