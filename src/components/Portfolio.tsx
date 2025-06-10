import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { usePortfolio, useFeaturedProjects } from '../hooks/usePortfolio';
import { LoadingSection, ErrorMessage } from './LoadingSpinner';

export const Portfolio: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Fetch projects based on active filter
  const { projects, loading, error } = usePortfolio({
    category: activeFilter === 'all' ? undefined : activeFilter,
    limit: 20
  });
  
  // Fetch featured projects separately for the featured section
  const { 
    projects: featuredProjects, 
    loading: featuredLoading, 
    error: featuredError 
  } = useFeaturedProjects();

  const categories = [
    { id: 'all', name: 'All Projects', icon: 'lucide:globe' },
    { id: 'web', name: 'Web Apps', icon: 'lucide:code' },
    { id: 'mobile', name: 'Mobile', icon: 'lucide:smartphone' },
    { id: 'backend', name: 'Backend', icon: 'lucide:database' },
    { id: 'ai', name: 'AI/ML', icon: 'lucide:zap' }
  ];

  // Helper function to get project icon/image
  const getProjectIcon = (project: any) => {
    if (project.image_url) {
      return <img src={project.image_url} alt={project.title} className="w-full h-full object-cover rounded-lg" />;
    }
    // Fallback to category-based icons
    const categoryIcons: Record<string, string> = {
      web: '🌐',
      mobile: '📱',
      backend: '⚙️',
      ai: '🤖',
      default: '💻'
    };
    return categoryIcons[project.category] || categoryIcons.default;
  };

  // Hide section if no projects at all and not loading
  const hasAnyProjects = projects.length > 0 || featuredProjects.length > 0;
  const isLoading = loading || featuredLoading;
  
  if (!isLoading && !hasAnyProjects && !error && !featuredError) {
    return null;
  }

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
                <Icon icon={category.icon} width={14} height={14} className="mr-1 sm:mr-2" />
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
            
            {featuredLoading ? (
              <LoadingSection message="Loading featured projects..." />
            ) : featuredError ? (
              <ErrorMessage message={featuredError} />
            ) : featuredProjects.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredProjects.slice(0, 2).map((project) => (
                  <div
                    key={project.id}
                    className="group bg-[rgb(var(--color-background))] rounded-lg border border-[rgb(var(--color-border))] p-8 hover:border-[rgb(var(--color-primary))] transition-all duration-300 hover:shadow-xl"
                  >
                    {/* Project Icon */}
                    <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] rounded-lg mb-6 text-4xl">
                      {getProjectIcon(project)}
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
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary))]/90 transition-colors duration-200"
                        >
                          <Icon icon="lucide:play" width={16} height={16} className="mr-2" />
                          Live Demo
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-4 py-2 border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] rounded-md hover:bg-[rgb(var(--color-muted))] transition-colors duration-200"
                        >
                          <Icon icon="simple-icons:github" width={16} height={16} className="mr-2" />
                          View Code
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-[rgb(var(--color-muted-foreground))]">No featured projects available.</p>
              </div>
            )}
          </div>
        )}

        {/* All Projects Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-[rgb(var(--color-foreground))] mb-8 text-center">
            {activeFilter === 'all' ? 'All Projects' : `${categories.find(c => c.id === activeFilter)?.name} Projects`}
          </h3>
          
          {loading ? (
            <LoadingSection message="Loading projects..." />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group bg-[rgb(var(--color-background))] rounded-lg border border-[rgb(var(--color-border))] p-6 hover:border-[rgb(var(--color-primary))] transition-all duration-300 hover:shadow-lg"
                >
                  {/* Project Icon */}
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] rounded-lg mb-4 text-2xl">
                    {getProjectIcon(project)}
                  </div>

                  {/* Project Info */}
                  <h4 className="text-lg font-bold text-[rgb(var(--color-foreground))] mb-2 group-hover:text-[rgb(var(--color-primary))] transition-colors duration-200">
                    {project.title}
                  </h4>
                  
                  <p className="text-[rgb(var(--color-muted-foreground))] mb-4 text-sm leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  {/* Status and Category */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 bg-[rgb(var(--color-muted))] text-[rgb(var(--color-foreground))] text-xs rounded capitalize">
                      {project.category}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded capitalize ${
                      project.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : project.status === 'in-progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status.replace('-', ' ')}
                    </span>
                    {project.featured && (
                      <span className="px-2 py-1 bg-[rgb(var(--color-primary))] text-white text-xs rounded">
                        Featured
                      </span>
                    )}
                  </div>

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
                      <span className="px-2 py-1 bg-[rgb(var(--color-muted))] text-[rgb(var(--color-foreground))] text-xs rounded">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary))]/90 transition-colors duration-200 text-sm"
                      >
                        <Icon icon="lucide:external-link" width={14} height={14} className="mr-1" />
                        Demo
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] rounded-md hover:bg-[rgb(var(--color-muted))] transition-colors duration-200 text-sm"
                      >
                        <Icon icon="simple-icons:github" width={14} height={14} className="mr-1" />
                        Code
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[rgb(var(--color-muted-foreground))]">
                No projects found for the selected category.
              </p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-[rgb(var(--color-muted))] rounded-lg p-8">
            <h3 className="text-2xl font-bold text-[rgb(var(--color-foreground))] mb-4">
              Interested in Working Together?
            </h3>
            <p className="text-[rgb(var(--color-muted-foreground))] mb-6 max-w-2xl mx-auto">
              I'm always excited to take on new challenges and create innovative solutions. 
              Let's discuss how I can help bring your project to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))]/90 transition-colors duration-200"
              >
                Start a Project
              </a>
              <a
                href="mailto:ericsson@budhilaw.com"
                className="inline-flex items-center justify-center px-8 py-3 border border-[rgb(var(--color-border))] text-base font-medium rounded-md text-[rgb(var(--color-foreground))] bg-transparent hover:bg-[rgb(var(--color-background))] transition-colors duration-200"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 