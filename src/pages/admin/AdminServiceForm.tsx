import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { RichTextEditor } from '../../components/admin/RichTextEditor';
import { ServiceService, Service } from '../../services/serviceService';
import { useNotification, Notification } from '../../components/Notification';

interface ServiceFormData {
  title: string;
  description: string;
  features: string[];
  category: string;
  active: boolean;
}

export const AdminServiceForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [activeTab, setActiveTab] = useState('basic');
  const [newFeature, setNewFeature] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { notification, showNotification: showNotif, hideNotification } = useNotification();

  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    description: '',
    features: [],
    category: 'development',
    active: true
  });

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
    
    // Handle single field validation error like "title: Title is required"
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

  // Load service data if editing
  useEffect(() => {
    if (isEditing && id) {
      const loadService = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await ServiceService.getServiceAdmin(id);
          if (response.error) {
            setError(errorToString(response.error));
          } else if (response.data) {
            const service = response.data;
            setFormData({
              title: service.title,
              description: service.description,
              features: service.features,
              category: service.category,
              active: service.active
            });
          }
        } catch (error) {
          setError('Failed to load service');
          console.error('Error loading service:', error);
        } finally {
          setLoading(false);
        }
      };

      loadService();
    }
  }, [isEditing, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});

    try {
      if (isEditing && id) {
        const response = await ServiceService.updateService(id, formData);
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
        showNotif('success', 'Service Updated Successfully', 'Your service has been updated and saved.');
      } else {
        const response = await ServiceService.createService(formData);
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
        showNotif('success', 'Service Created Successfully', 'Your new service has been added.');
        
        // Only redirect after creating a new service, not when editing
        setTimeout(() => navigate('/admin/services'), 1500);
      }
    } catch (error) {
      const errorMessage = 'Failed to save service';
      setError(errorMessage);
      showNotif('error', 'Save Failed', errorMessage);
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
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
    return (
      <div className="bg-[rgb(var(--color-background))] p-8 rounded-lg border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))] transition-all duration-300 hover:shadow-lg">
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[rgb(var(--color-foreground))]">
            {isEditing ? 'Edit Service' : 'New Service'}
          </h1>
        </div>
        <div className="text-center py-8">
          <p className="text-[rgb(var(--color-muted-foreground))]">Loading service...</p>
        </div>
      </div>
    );
  }

  if (error && isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[rgb(var(--color-foreground))]">
            Edit Service
          </h1>
        </div>
        <div className="text-center py-8">
          <p className="text-red-500">Error loading service: {error}</p>
          <button 
            onClick={() => navigate('/admin/services')}
            className="inline-flex items-center px-4 py-2 mt-4 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary))]/90 transition-colors"
          >
            Back to Services
          </button>
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
            disabled={isSubmitting}
            className="flex items-center px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary))]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Icon icon="lucide:save" width={16} height={16} className="mr-2" />
            {isSubmitting ? 'Saving...' : (isEditing ? 'Update Service' : 'Create Service')}
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
              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
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
                      value={formData.description}
                      onChange={(value) => handleInputChange('description', value)}
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
    </>
  );
}; 