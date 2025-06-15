import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { usePortfolioAdmin } from '../../hooks/usePortfolio';
import { PortfolioService } from '../../services/portfolioService';
import { formatTableDate } from '../../utils/dateFormatter';

export const AdminPortfolio: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    featured: 'all'
  });


  // Fetch projects using the hook
  const { projects, loading, error, total } = usePortfolioAdmin();



  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         project.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                         project.technologies.some(tech => tech.toLowerCase().includes(filters.search.toLowerCase()));
    
    const matchesCategory = filters.category === 'all' || project.category === filters.category;
    const matchesStatus = filters.status === 'all' || project.status === filters.status;
    const matchesFeatured = filters.featured === 'all' || 
                           (filters.featured === 'featured' && project.featured) ||
                           (filters.featured === 'not-featured' && !project.featured);

    return matchesSearch && matchesCategory && matchesStatus && matchesFeatured;
  });

  // Handle selection
  const handleSelectProject = (projectId: string) => {
    setSelectedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleSelectAll = () => {
    setSelectedProjects(
      selectedProjects.length === filteredProjects.length 
        ? [] 
        : filteredProjects.map(project => project.id)
    );
  };

  // Bulk actions
  const handleBulkAction = (action: string) => {
    // Handle bulk actions - implement API calls
    setSelectedProjects([]);
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'web':
        return <Icon icon="lucide:globe" width={16} height={16} className="text-blue-500" />;
      case 'mobile':
        return <Icon icon="lucide:smartphone" width={16} height={16} className="text-green-500" />;
      case 'backend':
        return <Icon icon="lucide:database" width={16} height={16} className="text-purple-500" />;
      case 'ai':
        return <Icon icon="lucide:zap" width={16} height={16} className="text-orange-500" />;
      default:
        return <Icon icon="lucide:briefcase" width={16} height={16} className="text-gray-500" />;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Icon icon="lucide:check-circle" width={16} height={16} className="text-green-500" />;
      case 'in-progress':
        return <Icon icon="lucide:clock" width={16} height={16} className="text-blue-500" />;
      case 'planned':
        return <Icon icon="lucide:alert-circle" width={16} height={16} className="text-orange-500" />;
      default:
        return <Icon icon="lucide:alert-circle" width={16} height={16} className="text-gray-500" />;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return formatTableDate(dateString);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[rgb(var(--color-foreground))]">Portfolio Projects</h1>
        </div>
        <div className="text-center py-8">
          <p className="text-[rgb(var(--color-muted-foreground))]">Loading portfolio projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[rgb(var(--color-foreground))]">Portfolio Projects</h1>
        </div>
        <div className="text-center py-8">
          <p className="text-red-500">Error loading portfolio projects: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[rgb(var(--color-foreground))]">
            Portfolio Projects
          </h1>
          <p className="text-[rgb(var(--color-muted-foreground))] mt-1">
            Manage your portfolio projects and showcase your work
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-2 border rounded-md transition-colors ${
              showFilters 
                ? 'bg-[rgb(var(--color-primary))] text-white border-[rgb(var(--color-primary))]'
                : 'border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-muted))]'
            }`}
          >
            <Icon icon="lucide:filter" width={16} height={16} className="mr-2" />
            Filters
          </button>
          <Link
            to="/admin/portfolio/new"
            className="flex items-center px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary))]/90 transition-colors"
          >
            <Icon icon="lucide:plus" width={16} height={16} className="mr-2" />
            New Project
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[rgb(var(--color-card))] p-4 rounded-lg border border-[rgb(var(--color-border))]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[rgb(var(--color-muted-foreground))]">Total Projects</p>
              <p className="text-2xl font-bold text-[rgb(var(--color-foreground))]">
                {loading ? '...' : total}
              </p>
            </div>
            <Icon icon="lucide:briefcase" className="text-[rgb(var(--color-primary))]" width={24} height={24} />
          </div>
        </div>
        <div className="bg-[rgb(var(--color-card))] p-4 rounded-lg border border-[rgb(var(--color-border))]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[rgb(var(--color-muted-foreground))]">Featured</p>
              <p className="text-2xl font-bold text-yellow-600">
                {loading ? '...' : projects.filter(p => p.featured).length}
              </p>
            </div>
            <Icon icon="lucide:star" className="text-yellow-600" width={24} height={24} />
          </div>
        </div>
        <div className="bg-[rgb(var(--color-card))] p-4 rounded-lg border border-[rgb(var(--color-border))]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[rgb(var(--color-muted-foreground))]">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {loading ? '...' : projects.filter(p => p.status === 'completed').length}
              </p>
            </div>
            <Icon icon="lucide:check-circle" className="text-green-600" width={24} height={24} />
          </div>
        </div>
        <div className="bg-[rgb(var(--color-card))] p-4 rounded-lg border border-[rgb(var(--color-border))]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[rgb(var(--color-muted-foreground))]">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {loading ? '...' : projects.filter(p => p.status === 'in-progress').length}
              </p>
            </div>
            <Icon icon="lucide:clock" className="text-blue-600" width={24} height={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-[rgb(var(--color-card))] p-6 rounded-lg border border-[rgb(var(--color-border))]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                Search
              </label>
              <div className="relative">
                <Icon icon="lucide:search" width={16} height={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[rgb(var(--color-muted-foreground))]" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="web">Web Apps</option>
                <option value="mobile">Mobile</option>
                <option value="backend">Backend</option>
                <option value="ai">AI/ML</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="planned">Planned</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                Featured
              </label>
              <select
                value={filters.featured}
                onChange={(e) => setFilters(prev => ({ ...prev, featured: e.target.value }))}
                className="w-full px-3 py-2 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
              >
                <option value="all">All Projects</option>
                <option value="featured">Featured Only</option>
                <option value="not-featured">Not Featured</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedProjects.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800 dark:text-blue-200">
              {selectedProjects.length} project{selectedProjects.length === 1 ? '' : 's'} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction('feature')}
                className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
              >
                Feature
              </button>
              <button
                onClick={() => handleBulkAction('unfeature')}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Unfeature
              </button>
              <button
                onClick={() => handleBulkAction('duplicate')}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Duplicate
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Projects Table */}
      <div className="bg-[rgb(var(--color-card))] rounded-lg border border-[rgb(var(--color-border))] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-[rgb(var(--color-muted))] border-b border-[rgb(var(--color-border))]">
              <tr>
                <th className="w-16 px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProjects.length === filteredProjects.length && filteredProjects.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-[rgb(var(--color-border))]"
                  />
                </th>
                <th className="w-80 px-6 py-4 text-left text-sm font-medium text-[rgb(var(--color-foreground))]">
                  Project
                </th>
                <th className="w-32 px-6 py-4 text-left text-sm font-medium text-[rgb(var(--color-foreground))]">
                  Category
                </th>
                <th className="w-36 px-6 py-4 text-left text-sm font-medium text-[rgb(var(--color-foreground))]">
                  Status
                </th>
                <th className="w-64 px-6 py-4 text-left text-sm font-medium text-[rgb(var(--color-foreground))]">
                  Technologies
                </th>
                <th className="w-40 px-6 py-4 text-left text-sm font-medium text-[rgb(var(--color-foreground))]">
                  Last Updated
                </th>
                <th className="w-72 px-6 py-4 text-left text-sm font-medium text-[rgb(var(--color-foreground))]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgb(var(--color-border))]">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-[rgb(var(--color-muted))] transition-colors">
                  <td className="px-6 py-5">
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(project.id)}
                      onChange={() => handleSelectProject(project.id)}
                      className="rounded border-[rgb(var(--color-border))]"
                    />
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] rounded-lg flex items-center justify-center text-2xl">
                        {project.image_url ? (
                          <img src={project.image_url} alt={project.title} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          '📁'
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-base font-semibold text-[rgb(var(--color-foreground))] truncate">
                            {project.title}
                          </p>
                          {project.featured && (
                            <Icon icon="lucide:star" width={16} height={16} className="text-yellow-500 fill-current flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-[rgb(var(--color-muted-foreground))] line-clamp-2 mb-2">
                          {project.description}
                        </p>
                        {project.client && (
                          <p className="text-xs text-[rgb(var(--color-muted-foreground))]">
                            <span className="font-medium">Client:</span> {project.client}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-3">
                      {getCategoryIcon(project.category)}
                      <span className="text-sm font-medium text-[rgb(var(--color-foreground))] capitalize">
                        {project.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(project.status)}
                      <span className="text-sm font-medium text-[rgb(var(--color-foreground))] capitalize">
                        {project.status.replace('-', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 4).map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[rgb(var(--color-muted))] text-[rgb(var(--color-foreground))] text-xs font-medium rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-3 py-1 bg-[rgb(var(--color-muted))] text-[rgb(var(--color-muted-foreground))] text-xs font-medium rounded-md">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-2 text-sm text-[rgb(var(--color-muted-foreground))]">
                      <Icon icon="lucide:calendar" width={16} height={16} />
                      <span className="font-medium">{formatDate(project.updated_at)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-3">
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-primary))] border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))] rounded-md transition-all"
                          title="View Live"
                        >
                          <Icon icon="lucide:external-link" width={14} height={14} className="mr-2" />
                          Live
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-primary))] border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))] rounded-md transition-all"
                          title="View Code"
                        >
                          <Icon icon="simple-icons:github" width={14} height={14} className="mr-2" />
                          Code
                        </a>
                      )}
                      <Link
                        to={`/admin/portfolio/${project.id}/edit`}
                        className="inline-flex items-center px-3 py-2 text-xs font-medium text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-primary))] border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))] rounded-md transition-all"
                        title="Edit Project"
                      >
                        <Icon icon="lucide:edit" width={14} height={14} className="mr-2" />
                        Edit
                      </Link>
                      <button
                        onClick={() => {/* Delete project logic */}}
                        className="inline-flex items-center px-3 py-2 text-xs font-medium text-[rgb(var(--color-muted-foreground))] hover:text-red-600 border border-[rgb(var(--color-border))] hover:border-red-300 rounded-md transition-all"
                        title="Delete Project"
                      >
                        <Icon icon="lucide:trash2" width={14} height={14} className="mr-2" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="p-12 text-center">
          <Icon icon="lucide:briefcase" width={48} height={48} className="mx-auto text-[rgb(var(--color-muted-foreground))] mb-4" />
          <h3 className="text-lg font-medium text-[rgb(var(--color-foreground))] mb-2">
            No projects found
          </h3>
          <p className="text-[rgb(var(--color-muted-foreground))] mb-6">
            {filters.search || filters.category !== 'all' || filters.status !== 'all' || filters.featured !== 'all'
              ? 'Try adjusting your filters to see more projects.'
              : 'Get started by creating your first portfolio project.'
            }
          </p>
          {(!filters.search && filters.category === 'all' && filters.status === 'all' && filters.featured === 'all') && (
            <Link
              to="/admin/portfolio/new"
              className="inline-flex items-center px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary))]/90 transition-colors"
            >
              <Icon icon="lucide:plus" width={16} height={16} className="mr-2" />
              Create First Project
            </Link>
          )}
        </div>
      )}
    </div>
  );
}; 