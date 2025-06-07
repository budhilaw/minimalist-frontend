import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Save, 
  X, 
  Eye,
  ArrowLeft,
  Plus,
  Trash2,
  Calendar,
  ExternalLink,
  Github,
  Star,
  Globe,
  Smartphone,
  Database,
  Zap
} from 'lucide-react';
import { portfolioProjects, PortfolioProject } from '../../data/portfolioProjects';
import { RichTextEditor } from '../../components/admin/RichTextEditor';

export const AdminPortfolioForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'advanced'>('basic');

  const [formData, setFormData] = useState<Omit<PortfolioProject, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    description: '',
    longDescription: '',
    category: 'web',
    technologies: [],
    image: '🚀',
    liveUrl: '',
    githubUrl: '',
    featured: false,
    status: 'planned',
    startDate: '',
    endDate: '',
    client: '',
    highlights: []
  });

  const [newTechnology, setNewTechnology] = useState('');
  const [newHighlight, setNewHighlight] = useState('');

  // Available options
  const categories = [
    { value: 'web', label: 'Web Apps', icon: Globe },
    { value: 'mobile', label: 'Mobile', icon: Smartphone },
    { value: 'backend', label: 'Backend', icon: Database },
    { value: 'ai', label: 'AI/ML', icon: Zap }
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
      const existingProject = portfolioProjects.find(project => project.id === id);
      if (existingProject) {
        setFormData({
          title: existingProject.title,
          description: existingProject.description,
          longDescription: existingProject.longDescription,
          category: existingProject.category,
          technologies: existingProject.technologies,
          image: existingProject.image,
          liveUrl: existingProject.liveUrl || '',
          githubUrl: existingProject.githubUrl || '',
          featured: existingProject.featured,
          status: existingProject.status,
          startDate: existingProject.startDate,
          endDate: existingProject.endDate || '',
          client: existingProject.client || '',
          highlights: existingProject.highlights
        });
      }
    }
  }, [isEditing, id]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log(isEditing ? 'Updating project:' : 'Creating project:', formData);
    
    setIsSubmitting(false);
    navigate('/admin/portfolio');
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

  // Handle highlight addition
  const addHighlight = () => {
    if (newHighlight.trim() && !formData.highlights.includes(newHighlight.trim())) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()]
      }));
      setNewHighlight('');
    }
  };

  // Handle highlight removal
  const removeHighlight = (highlight: string) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter(h => h !== highlight)
    }));
  };

  return (
    <>
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
                <X size={24} />
              </button>
            </div>

            {/* Preview Content */}
            <div className="p-6">
              <div className="bg-[rgb(var(--color-background))] rounded-lg border border-[rgb(var(--color-border))] p-8">
                {/* Project Icon */}
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] rounded-lg mb-6 text-4xl">
                  {formData.image}
                </div>

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
                  {formData.liveUrl && (
                    <div className="inline-flex items-center px-6 py-3 bg-[rgb(var(--color-primary))] text-white rounded-md">
                      <ExternalLink size={16} className="mr-2" />
                      Live Demo
                    </div>
                  )}
                  {formData.githubUrl && (
                    <div className="inline-flex items-center px-6 py-3 border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] rounded-md">
                      <Github size={16} className="mr-2" />
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
              <ArrowLeft size={20} className="mr-2" />
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
              <Eye size={16} className="mr-2" />
              Preview
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
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
                          className="w-full px-4 py-3 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
                          placeholder="Enter project title"
                        />
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
                          className="w-full px-4 py-3 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
                          placeholder="Brief description of the project"
                        />
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
                              onClick={() => setFormData(prev => ({ ...prev, image: emoji }))}
                              className={`w-12 h-12 text-2xl rounded-md border-2 transition-all ${
                                formData.image === emoji
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
                          value={formData.longDescription}
                          onChange={(value) => setFormData(prev => ({ ...prev, longDescription: value }))}
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
                              <Plus size={16} />
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
                                  <X size={14} />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Key Highlights */}
                      <div>
                        <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                          Key Highlights
                        </label>
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newHighlight}
                              onChange={(e) => setNewHighlight(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                              className="flex-1 px-4 py-2 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
                              placeholder="Add project highlight"
                            />
                            <button
                              type="button"
                              onClick={addHighlight}
                              className="px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary))]/90 transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <div className="space-y-2">
                            {formData.highlights.map((highlight, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between px-3 py-2 bg-[rgb(var(--color-muted))] rounded-md"
                              >
                                <span className="text-sm text-[rgb(var(--color-foreground))]">
                                  {highlight}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeHighlight(highlight)}
                                  className="text-[rgb(var(--color-muted-foreground))] hover:text-red-500"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
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
                            value={formData.liveUrl}
                            onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
                            className="w-full px-4 py-3 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
                            placeholder="https://example.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                            GitHub URL
                          </label>
                          <input
                            type="url"
                            value={formData.githubUrl}
                            onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                            className="w-full px-4 py-3 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
                            placeholder="https://github.com/username/repo"
                          />
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
                            value={formData.startDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                            className="w-full px-4 py-3 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
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
                    <Save size={16} className="mr-2" />
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