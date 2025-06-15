import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Github, Calendar, User, Tag } from 'lucide-react';
import { PortfolioService, PortfolioProject } from '../services/portfolioService';
import { MarkdownContent } from '../components/MarkdownContent';

export const PortfolioDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!slug) {
        setError('Project slug not found');
        setLoading(false);
        return;
      }

      try {
        const response = await PortfolioService.getProjectBySlug(slug);
        if (response.data) {
          setProject(response.data);
        } else {
          setError(response.error || 'Project not found');
        }
              } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load project';
          setError(errorMessage);
          console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
        <div className="pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-[rgb(var(--color-muted))] rounded mb-4"></div>
              <div className="h-64 bg-[rgb(var(--color-muted))] rounded mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-[rgb(var(--color-muted))] rounded w-3/4"></div>
                <div className="h-4 bg-[rgb(var(--color-muted))] rounded w-1/2"></div>
                <div className="h-4 bg-[rgb(var(--color-muted))] rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen w-full bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
        <div className="pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[rgb(var(--color-foreground))] mb-4">
                {error || 'Project not found'}
              </h1>
              <button
                onClick={() => navigate('/portfolio')}
                className="inline-flex items-center px-4 py-2 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] rounded-lg hover:bg-[rgb(var(--color-primary))]/90 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen w-full bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/portfolio')}
            className="inline-flex items-center text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-foreground))] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portfolio
          </button>

          {/* Project Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold text-[rgb(var(--color-foreground))]">
                {project.title}
              </h1>
              {project.featured && (
                <span className="px-2 py-1 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] text-xs font-medium rounded-full">
                  Featured
                </span>
              )}
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                {project.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            
            <p className="text-lg text-[rgb(var(--color-muted-foreground))] mb-6">
              {project.description}
            </p>

            {/* Project Meta */}
            <div className="flex flex-wrap gap-6 text-sm text-[rgb(var(--color-muted-foreground))] mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDate(project.start_date)}
                  {project.end_date && ` - ${formatDate(project.end_date)}`}
                </span>
              </div>
              
              {project.client && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{project.client}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>{project.category}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] rounded-lg hover:bg-[rgb(var(--color-primary))]/90 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Live
                </a>
              )}
              
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] rounded-lg hover:bg-[rgb(var(--color-muted))] transition-colors"
                >
                  <Github className="w-4 h-4 mr-2" />
                  View Code
                </a>
              )}
            </div>
          </div>

          {/* Project Image */}
          {project.image_url && (
            <div className="mb-8">
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-64 sm:h-80 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Technologies */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[rgb(var(--color-foreground))] mb-4">
              Technologies Used
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-[rgb(var(--color-muted))] text-[rgb(var(--color-foreground))] text-sm rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Long Description with Markdown */}
          {project.long_description && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[rgb(var(--color-foreground))] mb-4">
                Project Details
              </h2>
              <MarkdownContent content={project.long_description} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 