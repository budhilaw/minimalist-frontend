import React, { useState } from 'react';
import { ExternalLink, Github, Play, Code, Smartphone, Globe, Database, Zap } from 'lucide-react';

export const Portfolio: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with React, Node.js, and PostgreSQL. Features include real-time inventory, payment integration, and admin dashboard.',
      category: 'web',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS'],
      image: '🛒',
      liveUrl: 'https://demo-ecommerce.example.com',
      githubUrl: 'https://github.com/johndoe/ecommerce-platform',
      featured: true,
      highlights: [
        'Handles 10K+ concurrent users',
        'Real-time inventory management',
        'Integrated payment processing',
        'Admin analytics dashboard'
      ]
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Collaborative project management tool with real-time updates, drag-and-drop interface, and team collaboration features.',
      category: 'web',
      technologies: ['React', 'TypeScript', 'Socket.io', 'MongoDB', 'Express'],
      image: '📋',
      liveUrl: 'https://taskflow-demo.example.com',
      githubUrl: 'https://github.com/johndoe/taskflow',
      featured: true,
      highlights: [
        'Real-time collaboration',
        'Drag-and-drop interface',
        'Team workspace management',
        'Advanced filtering & search'
      ]
    },
    {
      id: 3,
      title: 'Mobile Banking App',
      description: 'React Native mobile application for digital banking with biometric authentication, transaction history, and bill payments.',
      category: 'mobile',
      technologies: ['React Native', 'TypeScript', 'Redux', 'Firebase', 'Biometric Auth'],
      image: '📱',
      liveUrl: 'https://apps.apple.com/bankapp',
      githubUrl: null, // Private repo
      featured: false,
      highlights: [
        'Biometric authentication',
        'Real-time notifications',
        'Bill payment integration',
        'Transaction analytics'
      ]
    },
    {
      id: 4,
      title: 'API Gateway Service',
      description: 'Microservices API gateway with rate limiting, authentication, request routing, and comprehensive logging.',
      category: 'backend',
      technologies: ['Node.js', 'Docker', 'Redis', 'JWT', 'Nginx'],
      image: '🔧',
      liveUrl: null,
      githubUrl: 'https://github.com/johndoe/api-gateway',
      featured: false,
      highlights: [
        'Rate limiting & throttling',
        'JWT authentication',
        'Request routing',
        'Comprehensive logging'
      ]
    },
    {
      id: 5,
      title: 'Data Analytics Dashboard',
      description: 'Interactive dashboard for business intelligence with real-time data visualization, custom reports, and export capabilities.',
      category: 'web',
      technologies: ['Vue.js', 'D3.js', 'Python', 'FastAPI', 'PostgreSQL'],
      image: '📊',
      liveUrl: 'https://analytics-demo.example.com',
      githubUrl: 'https://github.com/johndoe/analytics-dashboard',
      featured: true,
      highlights: [
        'Real-time data visualization',
        'Custom report builder',
        'Export to multiple formats',
        'Interactive charts & graphs'
      ]
    },
    {
      id: 6,
      title: 'AI Chat Assistant',
      description: 'Intelligent chatbot with natural language processing, context awareness, and integration with multiple platforms.',
      category: 'ai',
      technologies: ['Python', 'TensorFlow', 'React', 'WebSocket', 'Docker'],
      image: '🤖',
      liveUrl: 'https://chatbot-demo.example.com',
      githubUrl: 'https://github.com/johndoe/ai-assistant',
      featured: false,
      highlights: [
        'Natural language processing',
        'Context-aware responses',
        'Multi-platform integration',
        'Learning capabilities'
      ]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Projects', icon: Globe },
    { id: 'web', name: 'Web Apps', icon: Code },
    { id: 'mobile', name: 'Mobile', icon: Smartphone },
    { id: 'backend', name: 'Backend', icon: Database },
    { id: 'ai', name: 'AI/ML', icon: Zap }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  const featuredProjects = projects.filter(project => project.featured);

  return (
    <section id="portfolio" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-[rgb(var(--color-foreground))] sm:text-4xl">
            Portfolio
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-[rgb(var(--color-muted-foreground))]">
            A showcase of projects I've built and contributed to over the years
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`inline-flex items-center px-3 py-2 sm:px-6 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                  activeFilter === category.id
                    ? 'bg-[rgb(var(--color-primary))] text-white shadow-lg'
                    : 'bg-[rgb(var(--color-muted))] text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-primary))] hover:text-white'
                }`}
              >
                <IconComponent size={14} className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{category.name}</span>
                <span className="sm:hidden">{category.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Featured Projects */}
        {activeFilter === 'all' && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-[rgb(var(--color-foreground))] mb-8 text-center">
              Featured Projects
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredProjects.slice(0, 2).map((project) => (
                <div
                  key={project.id}
                  className="group bg-[rgb(var(--color-background))] rounded-lg border border-[rgb(var(--color-border))] p-8 hover:border-[rgb(var(--color-primary))] transition-all duration-300 hover:shadow-xl"
                >
                  {/* Project Icon */}
                  <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] rounded-lg mb-6 text-4xl">
                    {project.image}
                  </div>

                  {/* Featured Badge */}
                  <div className="mb-4">
                    <span className="px-3 py-1 bg-[rgb(var(--color-primary))] text-white text-sm font-medium rounded-full">
                      Featured
                    </span>
                  </div>

                  {/* Project Info */}
                  <h4 className="text-xl font-bold text-[rgb(var(--color-foreground))] mb-3 group-hover:text-[rgb(var(--color-primary))] transition-colors duration-200">
                    {project.title}
                  </h4>
                  
                  <p className="text-[rgb(var(--color-muted-foreground))] mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Highlights */}
                  <ul className="space-y-2 mb-6">
                    {project.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start text-sm text-[rgb(var(--color-muted-foreground))]">
                        <span className="w-1.5 h-1.5 bg-[rgb(var(--color-accent))] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-[rgb(var(--color-muted))] text-[rgb(var(--color-foreground))] text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary))]/90 transition-colors duration-200"
                      >
                        <ExternalLink size={16} className="mr-2" />
                        Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2 border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] rounded-md hover:bg-[rgb(var(--color-muted))] transition-colors duration-200"
                      >
                        <Github size={16} className="mr-2" />
                        Code
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-[rgb(var(--color-background))] rounded-lg border border-[rgb(var(--color-border))] p-6 hover:border-[rgb(var(--color-primary))] transition-all duration-300 hover:shadow-lg"
            >
              {/* Project Icon */}
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] rounded-lg mb-4 text-2xl">
                {project.image}
              </div>

              {/* Featured Badge */}
              {project.featured && (
                <div className="mb-3">
                  <span className="px-2 py-1 bg-[rgb(var(--color-primary))] text-white text-xs font-medium rounded-full">
                    Featured
                  </span>
                </div>
              )}

              {/* Project Info */}
              <h4 className="text-lg font-bold text-[rgb(var(--color-foreground))] mb-2 group-hover:text-[rgb(var(--color-primary))] transition-colors duration-200">
                {project.title}
              </h4>
              
              <p className="text-[rgb(var(--color-muted-foreground))] mb-4 text-sm line-clamp-3">
                {project.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1 mb-4">
                {project.technologies.slice(0, 3).map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-[rgb(var(--color-muted))] text-[rgb(var(--color-foreground))] text-xs rounded"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="px-2 py-1 bg-[rgb(var(--color-muted))] text-[rgb(var(--color-muted-foreground))] text-xs rounded">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 bg-[rgb(var(--color-primary))] text-white text-sm rounded-md hover:bg-[rgb(var(--color-primary))]/90 transition-colors duration-200"
                  >
                    <ExternalLink size={14} className="mr-1" />
                    Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] text-sm rounded-md hover:bg-[rgb(var(--color-muted))] transition-colors duration-200"
                  >
                    <Github size={14} className="mr-1" />
                    Code
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-[rgb(var(--color-muted))] rounded-lg p-8">
            <h3 className="text-2xl font-bold text-[rgb(var(--color-foreground))] mb-4">
              Interested in Working Together?
            </h3>
            <p className="text-[rgb(var(--color-muted-foreground))] mb-6 max-w-2xl mx-auto">
              These projects represent just a fraction of my work. I'd love to discuss how I can help 
              bring your next project to life with clean code, modern architecture, and attention to detail.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto sm:max-w-none">
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary))]/90 transition-colors duration-200"
              >
                Start a Project
              </a>
              <a
                href="https://github.com/johndoe"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] rounded-md hover:bg-[rgb(var(--color-background))] transition-colors duration-200"
              >
                <Github size={16} className="mr-2" />
                View All Projects
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 