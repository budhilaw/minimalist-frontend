import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { RichTextEditor } from '../../components/admin/RichTextEditor';
import { services, iconMap, Service } from '../../data/services';

interface ServiceFormData {
  title: string;
  description: string;
  longDescription: string;
  features: string[];
  icon: string;
  category: 'development' | 'consulting' | 'design' | 'devops';
}

export const AdminServiceForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [activeTab, setActiveTab] = useState('basic');
  const [newFeature, setNewFeature] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    description: '',
    longDescription: '',
    features: [],
    icon: 'code',
    category: 'development'
  });

  // Load service data if editing
  useEffect(() => {
    if (isEditing && id) {
      const service = services.find(s => s.id === id);
      if (service) {
        setFormData({
          title: service.title,
          description: service.description,
          longDescription: service.longDescription || '',
          features: [...service.features],
          icon: service.icon,
          category: service.category
        });
      }
    }
  }, [isEditing, id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Navigate back to services list
    navigate('/admin/services');
  };

  const handleInputChange = (field: keyof ServiceFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const tabs = [
    { id: 'basic', name: 'Basic Info', icon: 'lucide:settings' },
    { id: 'details', name: 'Details & Description', icon: 'lucide:tag' }
  ];

  // Preview component
  const ServicePreview = () => {
    const iconName = iconMap[formData.icon] || iconMap.code;
    
    return (
      <div className="bg-[rgb(var(--color-background))] p-8 rounded-lg border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))] transition-all duration-300 hover:shadow-lg">
        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 bg-[rgb(var(--color-primary))] rounded-lg mb-6">
          <Icon icon={iconName} className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-[rgb(var(--color-foreground))] mb-4">
          {formData.title || 'Service Title'}
        </h3>
        <p className="text-[rgb(var(--color-muted-foreground))] mb-6 leading-relaxed">
          {formData.description || 'Service description will appear here...'}
        </p>

        {/* Features List */}
        <ul className="space-y-2">
          {formData.features.map((feature, idx) => (
            <li key={idx} className="flex items-start text-sm text-[rgb(var(--color-muted-foreground))]">
              <span className="w-1.5 h-1.5 bg-[rgb(var(--color-accent))] rounded-full mt-2 mr-3 flex-shrink-0"></span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/services')}
            className="p-2 text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-foreground))] transition-colors"
          >
            <Icon icon="lucide:arrow-left" width={20} height={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[rgb(var(--color-foreground))]">
              {isEditing ? 'Edit Service' : 'Create New Service'}
            </h1>
            <p className="text-[rgb(var(--color-muted-foreground))] mt-1">
              {isEditing ? 'Update service information and settings' : 'Add a new service to your portfolio'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center px-4 py-2 text-[rgb(var(--color-foreground))] border border-[rgb(var(--color-border))] rounded-md hover:bg-[rgb(var(--color-muted))] transition-colors"
          >
            <Icon icon="lucide:eye" width={16} height={16} className="mr-2" />
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary))]/90 transition-colors"
          >
            <Icon icon="lucide:save" width={16} height={16} className="mr-2" />
            {isEditing ? 'Update Service' : 'Create Service'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-[rgb(var(--color-card))] rounded-lg border border-[rgb(var(--color-border))] overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-[rgb(var(--color-border))]">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => {
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-[rgb(var(--color-primary))] text-[rgb(var(--color-primary))]'
                          : 'border-transparent text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-foreground))]'
                      }`}
                    >
                      <Icon icon={tab.icon} className="w-4 h-4 mr-2" />
                      {tab.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <form onSubmit={handleSubmit} className="p-6">
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                      Service Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-[rgb(var(--color-border))] rounded-md focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]"
                      placeholder="Enter service title..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                      Short Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-[rgb(var(--color-border))] rounded-md focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]"
                      placeholder="Brief description for service cards..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                        Icon
                      </label>
                      <select
                        value={formData.icon}
                        onChange={(e) => handleInputChange('icon', e.target.value)}
                        className="w-full px-3 py-2 border border-[rgb(var(--color-border))] rounded-md focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]"
                      >
                        <option value="code">Code</option>
                        <option value="rocket">Rocket</option>
                        <option value="settings">Settings</option>
                        <option value="users">Users</option>
                        <option value="search">Search</option>
                        <option value="shield">Shield</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value as any)}
                        className="w-full px-3 py-2 border border-[rgb(var(--color-border))] rounded-md focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]"
                      >
                        <option value="development">Development</option>
                        <option value="consulting">Consulting</option>
                        <option value="design">Design</option>
                        <option value="devops">DevOps</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Details Tab */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                      Detailed Description
                    </label>
                    <RichTextEditor
                      value={formData.longDescription}
                      onChange={(value) => handleInputChange('longDescription', value)}
                      placeholder="Write a detailed description of the service using markdown..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                      Service Features
                    </label>
                    <div className="space-y-3">
                      {formData.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => {
                              const newFeatures = [...formData.features];
                              newFeatures[index] = e.target.value;
                              handleInputChange('features', newFeatures);
                            }}
                            className="flex-1 px-3 py-2 border border-[rgb(var(--color-border))] rounded-md focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]"
                            placeholder="Feature description..."
                          />
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors dark:hover:bg-red-900/30"
                          >
                            <Icon icon="lucide:x" width={16} height={16} />
                          </button>
                        </div>
                      ))}
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                          className="flex-1 px-3 py-2 border border-[rgb(var(--color-border))] rounded-md focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]"
                          placeholder="Add new feature..."
                        />
                        <button
                          type="button"
                          onClick={addFeature}
                          className="p-2 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary))]/90 transition-colors"
                        >
                          <Icon icon="lucide:plus" width={16} height={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <h3 className="text-lg font-semibold text-[rgb(var(--color-foreground))] mb-4">
                Service Preview
              </h3>
              <ServicePreview />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 