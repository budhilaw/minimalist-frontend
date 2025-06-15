import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { PortfolioService, PortfolioProject } from '../../services/portfolioService';
import { RichTextEditor } from '../../components/admin/RichTextEditor';
import { useNotification, Notification } from '../../components/Notification';

export const AdminPortfolioForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'advanced'>('basic');
  const { notification, showNotification: showNotif, hideNotification } = useNotification();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    long_description: '',
    category: 'web',
    technologies: [] as string[],
    image_url: '',
    live_url: '',
    github_url: '',
    featured: false,
    active: true,
    status: 'planned',
    start_date: '',
    end_date: '',
    client: ''
  });

  const [newTechnology, setNewTechnology] = useState('');

  // Parse validation errors from API response
  const parseValidationError = (errorMessage: any) => {
    const errors: Record<string, string> = {};
    
    // Convert error to string if it's not already
    let errorStr: string;
    if (typeof errorMessage === 'string') {
      errorStr = errorMessage;
    } else if (errorMessage && typeof errorMessage === 'object') {
      // Handle backend error objects like {code, message, timestamp}
      errorStr = errorMessage.message || errorMessage.error || JSON.stringify(errorMessage);
    } else {
      errorStr = String(errorMessage || '');
    }
    
    // Handle single field validation error like "live_url: Live URL must be a valid URL"
    if (errorStr.includes(':')) {
      const parts = errorStr.split(':');
      if (parts.length >= 2) {
        const field = parts[0].trim();
        const message = parts.slice(1).join(':').trim();
        errors[field] = message;
      }
    }
    
    return errors;
  };

  // Convert any error to string
  const errorToString = (error: any): string => {
    if (typeof error === 'string') {
      return error;
    } else if (error && typeof error === 'object') {
      return error.message || error.error || JSON.stringify(error);
    } else {
      return String(error || 'Unknown error');
    }
  };

  // Available options
  const categories = [
    { value: 'web', label: 'Web Apps', icon: 'lucide:globe' },
    { value: 'mobile', label: 'Mobile', icon: 'lucide:smartphone' },
    { value: 'backend', label: 'Backend', icon: 'lucide:database' },
    { value: 'ai', label: 'AI/ML', icon: 'lucide:zap' }
  ];

  const statuses = [
    { value: 'planned', label: 'Planned' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ];

  const emojiOptions = ['🚀', '💼', '🛒', '📱', '🔧', '📊', '🤖', '🎯', '⚡', '🌟', '🔥', '💡'];

  // Load existing project data for editing
  useEffect(() => {
    if (isEditing && id) {
      const loadProject = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await PortfolioService.getProjectAdmin(id);
          if (response.error) {
            setError(errorToString(response.error));
          } else if (response.data) {
            const project = response.data;
            setFormData({
              title: project.title,
              slug: project.slug,
              description: project.description,
              long_description: project.long_description || '',
              category: project.category,
              technologies: project.technologies,
              image_url: project.image_url || '',
              live_url: project.live_url || '',
              github_url: project.github_url || '',
              featured: project.featured,
              active: project.active,
              status: project.status,
              start_date: project.start_date,
              end_date: project.end_date || '',
              client: project.client || ''
            });
          }
        } catch (error) {
          setError('Failed to load project');
          console.error('Error loading project:', error);
        } finally {
          setLoading(false);
        }
      };

      loadProject();
    }
  }, [isEditing, id]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});

    try {
      if (isEditing && id) {
        const response = await PortfolioService.updateProject(id, formData);
        if (response.error) {
          // Parse validation errors
          const validationErrors = parseValidationError(response.error);
          if (Object.keys(validationErrors).length > 0) {
            setFieldErrors(validationErrors);
            showNotif('error', 'Validation Error', 'Please fix the validation errors below');
          } else {
            const errorMsg = errorToString(response.error);
            setError(errorMsg);
            showNotif('error', 'Update Failed', errorMsg);
          }
          return;
        }
        showNotif('success', 'Project Updated Successfully', 'Your project has been updated and saved.');
      } else {
        const response = await PortfolioService.createProject(formData);
        if (response.error) {
          // Parse validation errors
          const validationErrors = parseValidationError(response.error);
          if (Object.keys(validationErrors).length > 0) {
            setFieldErrors(validationErrors);
            showNotif('error', 'Validation Error', 'Please fix the validation errors below');
          } else {
            const errorMsg = errorToString(response.error);
            setError(errorMsg);
            showNotif('error', 'Creation Failed', errorMsg);
          }
          return;
        }
        showNotif('success', 'Project Created Successfully', 'Your new project has been added to your portfolio.');
        
        // Only redirect after creating a new project, not when editing
        setTimeout(() => navigate('/admin/portfolio'), 1500);
      }
    } catch (error) {
      const errorMessage = 'Failed to save project';
      setError(errorMessage);
      showNotif('error', 'Save Failed', errorMessage);
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle technology addition
  const addTechnology = () => {
    if (newTechnology.trim() && !formData.technologies.includes(newTechnology.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()]
      }));
      setNewTechnology('');
    }
  };

  // Handle technology removal
  const removeTechnology = (technology: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== technology)
    }));
  };



  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[rgb(var(--color-foreground))]">
            {isEditing ? 'Edit Project' : 'New Project'}
          </h1>
        </div>
        <div className="text-center py-8">
          <p className="text-[rgb(var(--color-muted-foreground))]">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error && isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[rgb(var(--color-foreground))]">
            Edit Project
          </h1>
        </div>
        <div className="text-center py-8">
          <p className="text-red-500">Error loading project: {error}</p>
          <Link 
            to="/admin/portfolio"
            className="inline-flex items-center px-4 py-2 mt-4 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary))]/90 transition-colors"
          >
            Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Notification */}
      {notification && (
        <div className="mb-6">
          <Notification
            type={notification.type}
            title={notification.title}
            message={notification.message}
            description={notification.description}
            onClose={hideNotification}
          />
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-[rgb(var(--color-card))] rounded-lg border border-[rgb(var(--color-border))] w-full max-w-4xl my-8">
            {/* Preview Header */}
            <div className="flex items-center justify-between p-6 border-b border-[rgb(var(--color-border))]">
              <h2 className="text-xl font-semibold text-[rgb(var(--color-foreground))]">
                Project Preview
              </h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-foreground))]"
              >
                <Icon icon="lucide:x" width={24} height={24} />
              </button>
            </div>

            {/* Preview Content */}
            <div className="p-6">
              <div className="bg-[rgb(var(--color-background))] rounded-lg border border-[rgb(var(--color-border))] p-8">
                {/* Project Image */}
                {formData.image_url && (
                  <div className="mb-6">
                    <img 
                      src={formData.image_url} 
                      alt={formData.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Featured Badge */}
                {formData.featured && (
                  <div className="mb-4">
                    <span className="px-3 py-1 bg-[rgb(var(--color-primary))] text-white text-sm font-medium rounded-full">
                      Featured
                    </span>
                  </div>
                )}

                {/* Project Info */}
                <h3 className="text-2xl font-bold text-[rgb(var(--color-foreground))] mb-3">
                  {formData.title || 'Project Title'}
                </h3>
                
                <p className="text-[rgb(var(--color-muted-foreground))] mb-6 leading-relaxed">
                  {formData.description || 'Project description will appear here...'}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {formData.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[rgb(var(--color-muted))] text-[rgb(var(--color-foreground))] text-sm rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {formData.live_url && (
                    <div className="inline-flex items-center px-6 py-3 bg-[rgb(var(--color-primary))] text-white rounded-md">
                      <Icon icon="lucide:external-link" width={16} height={16} className="mr-2" />
                      Live Demo
                    </div>
                  )}
                  {formData.github_url && (
                    <div className="inline-flex items-center px-6 py-3 border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] rounded-md">
                      <Icon icon="simple-icons:github" width={16} height={16} className="mr-2" />
                      View Code
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/portfolio"
              className="flex items-center text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-foreground))] transition-colors"
            >
              <Icon icon="lucide:arrow-left" width={20} height={20} className="mr-2" />
              Back to Portfolio
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[rgb(var(--color-foreground))]">
                {isEditing ? 'Edit Project' : 'New Project'}
              </h1>
              <p className="text-[rgb(var(--color-muted-foreground))] mt-1">
                {isEditing ? 'Update your project details' : 'Create a new portfolio project'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="flex items-center px-4 py-2 border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] rounded-md hover:bg-[rgb(var(--color-muted))] transition-colors"
            >
              <Icon icon="lucide:eye" width={16} height={16} className="mr-2" />
              Preview
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Tabs */}
              <div className="bg-[rgb(var(--color-card))] rounded-lg border border-[rgb(var(--color-border))] overflow-hidden">
                <div className="border-b border-[rgb(var(--color-border))]">
                  <nav className="flex">
                    {[
                      { id: 'basic', label: 'Basic Info' },
                      { id: 'details', label: 'Details' },
                      { id: 'advanced', label: 'Advanced' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 px-6 py-3 text-sm font-medium border-r border-[rgb(var(--color-border))] last:border-r-0 transition-colors ${
                          activeTab === tab.id
                            ? 'bg-[rgb(var(--color-primary))] text-white'
                            : 'text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-muted))]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-6">
                  {/* Basic Info Tab */}
                  {activeTab === 'basic' && (
                    <div className="space-y-6">
                      {/* Title */}
                      <div>
                        <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                          Project Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          className={`w-full px-4 py-3 border rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent ${
                            fieldErrors.title ? 'border-red-500' : 'border-[rgb(var(--color-border))]'
                          }`}
                          placeholder="Enter project title"
                        />
                        {fieldErrors.title && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <Icon icon="lucide:alert-circle" width={16} height={16} className="mr-1" />
                            {fieldErrors.title}
                          </p>
                        )}
                      </div>

                      {/* Slug */}
                      <div>
                        <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                          URL Slug *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.slug}
                          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                          className={`w-full px-4 py-3 border rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent ${
                            fieldErrors.slug ? 'border-red-500' : 'border-[rgb(var(--color-border))]'
                          }`}
                          placeholder="e.g., my-awesome-project"
                        />
                        <p className="mt-1 text-xs text-[rgb(var(--color-muted-foreground))]">
                          This will be used in the URL: /portfolio/{formData.slug || 'your-slug'}
                        </p>
                        {fieldErrors.slug && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <Icon icon="lucide:alert-circle" width={16} height={16} className="mr-1" />
                            {fieldErrors.slug}
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                          Short Description *
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          className={`w-full px-4 py-3 border rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent ${
                            fieldErrors.description ? 'border-red-500' : 'border-[rgb(var(--color-border))]'
                          }`}
                          placeholder="Brief description of the project"
                        />
                        {fieldErrors.description && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <Icon icon="lucide:alert-circle" width={16} height={16} className="mr-1" />
                            {fieldErrors.description}
                          </p>
                        )}
                      </div>

                      {/* Category & Status */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                            Category
                          </label>
                          <select
                            value={formData.category}
                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                            className="w-full px-4 py-3 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
                          >
                            {categories.map((category) => (
                              <option key={category.value} value={category.value}>
                                {category.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                            Status
                          </label>
                          <select
                            value={formData.status}
                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                            className="w-full px-4 py-3 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
                          >
                            {statuses.map((status) => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Project Icon */}
                      <div>
                        <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                          Project Icon
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {emojiOptions.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, image_url: emoji }))}
                              className={`w-12 h-12 text-2xl rounded-md border-2 transition-all ${
                                formData.image_url === emoji
                                  ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/10'
                                  : 'border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))]'
                              }`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Details Tab */}
                  {activeTab === 'details' && (
                    <div className="space-y-6">
                      {/* Long Description */}
                      <div>
                        <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                          Detailed Description
                        </label>
                        <RichTextEditor
                          value={formData.long_description}
                          onChange={(value) => setFormData(prev => ({ ...prev, long_description: value }))}
                          placeholder="Write a detailed description using markdown..."
                          minHeight="300px"
                        />
                      </div>

                      {/* Technologies */}
                      <div>
                        <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                          Technologies Used
                        </label>
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newTechnology}
                              onChange={(e) => setNewTechnology(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                              className="flex-1 px-4 py-2 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
                              placeholder="Add technology (e.g., React, Node.js)"
                            />
                            <button
                              type="button"
                              onClick={addTechnology}
                              className="px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary))]/90 transition-colors"
                            >
                              <Icon icon="lucide:plus" width={16} height={16} />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {formData.technologies.map((tech, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 bg-[rgb(var(--color-muted))] text-[rgb(var(--color-foreground))] text-sm rounded-md"
                              >
                                {tech}
                                <button
                                  type="button"
                                  onClick={() => removeTechnology(tech)}
                                  className="ml-2 text-[rgb(var(--color-muted-foreground))] hover:text-red-500"
                                >
                                  <Icon icon="lucide:x" width={14} height={14} />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>


                    </div>
                  )}

                  {/* Advanced Tab */}
                  {activeTab === 'advanced' && (
                    <div className="space-y-6">
                      {/* URLs */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                            Live URL
                          </label>
                          <input
                            type="url"
                            value={formData.live_url}
                            onChange={(e) => setFormData(prev => ({ ...prev, live_url: e.target.value }))}
                            className={`w-full px-4 py-3 border rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent ${
                              fieldErrors.live_url ? 'border-red-500' : 'border-[rgb(var(--color-border))]'
                            }`}
                            placeholder="https://example.com"
                          />
                          {fieldErrors.live_url && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <Icon icon="lucide:alert-circle" width={16} height={16} className="mr-1" />
                              {fieldErrors.live_url}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                            GitHub URL
                          </label>
                          <input
                            type="url"
                            value={formData.github_url}
                            onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                            className={`w-full px-4 py-3 border rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent ${
                              fieldErrors.github_url ? 'border-red-500' : 'border-[rgb(var(--color-border))]'
                            }`}
                            placeholder="https://github.com/username/repo"
                          />
                          {fieldErrors.github_url && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <Icon icon="lucide:alert-circle" width={16} height={16} className="mr-1" />
                              {fieldErrors.github_url}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={formData.start_date}
                            onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                            className="w-full px-4 py-3 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={formData.end_date}
                            onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                            className="w-full px-4 py-3 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
                          />
                          <p className="text-xs text-[rgb(var(--color-muted-foreground))] mt-1">
                            Leave empty for ongoing projects
                          </p>
                        </div>
                      </div>

                      {/* Client */}
                      <div>
                        <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                          Client/Company
                        </label>
                        <input
                          type="text"
                          value={formData.client}
                          onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                          className="w-full px-4 py-3 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
                          placeholder="Client or company name (optional)"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publish Settings */}
              <div className="bg-[rgb(var(--color-card))] p-6 rounded-lg border border-[rgb(var(--color-border))]">
                <h3 className="text-lg font-semibold text-[rgb(var(--color-foreground))] mb-4">
                  Project Settings
                </h3>
                
                <div className="space-y-4">
                  {/* Featured Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-[rgb(var(--color-foreground))]">
                        Featured Project
                      </label>
                      <p className="text-xs text-[rgb(var(--color-muted-foreground))]">
                        Show this project prominently
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[rgb(var(--color-muted))] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[rgb(var(--color-primary))]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[rgb(var(--color-primary))]"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-[rgb(var(--color-card))] p-6 rounded-lg border border-[rgb(var(--color-border))]">
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center px-4 py-3 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary))]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Icon icon="lucide:save" width={16} height={16} className="mr-2" />
                    {isSubmitting ? 'Saving...' : (isEditing ? 'Update Project' : 'Create Project')}
                  </button>
                  
                  <Link
                    to="/admin/portfolio"
                    className="w-full flex items-center justify-center px-4 py-3 border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] rounded-md hover:bg-[rgb(var(--color-muted))] transition-colors"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}; 