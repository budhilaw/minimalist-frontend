import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useServicesAdmin } from '../../hooks/useServices';
import { ServiceService } from '../../services/serviceService';
import { useNotification, Notification } from '../../components/Notification';

export const AdminServices: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all'
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bulkActionLoading, setBulkActionLoading] = useState<string | null>(null);

  // Fetch services using the hook
  const { services, loading, error, total, refetch } = useServicesAdmin();
  const { notification, showNotification, hideNotification } = useNotification();



  // Filter services
  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         service.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                         service.features.some(feature => feature.toLowerCase().includes(filters.search.toLowerCase()));
    
    const matchesCategory = filters.category === 'all' || service.category === filters.category;
    const matchesStatus = filters.status === 'all' || 
                         (filters.status === 'active' && service.active) ||
                         (filters.status === 'inactive' && !service.active);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handle selection
  const handleSelectService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSelectAll = () => {
    setSelectedServices(
      selectedServices.length === filteredServices.length 
        ? [] 
        : filteredServices.map(service => service.id)
    );
  };

  // Delete service
  const handleDeleteService = async (serviceId: string, serviceName: string) => {
    if (!confirm(`Are you sure you want to delete "${serviceName}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(serviceId);
    try {
      const response = await ServiceService.deleteService(serviceId);
      
      if (response.error) {
        showNotification('error', 'Delete Failed', response.error);
        return;
      }

      showNotification('success', 'Service Deleted', `"${serviceName}" has been successfully deleted.`);
      refetch(); // Refresh the services list
    } catch (error) {
      showNotification('error', 'Delete Failed', 'An unexpected error occurred while deleting the service.');
    } finally {
      setDeletingId(null);
    }
  };

  // Bulk actions
  const handleBulkAction = async (action: string) => {
    if (selectedServices.length === 0) return;

    const actionText = action === 'activate' ? 'activate' : action === 'deactivate' ? 'deactivate' : 'delete';
    const confirmMessage = action === 'delete' 
      ? `Are you sure you want to delete ${selectedServices.length} service${selectedServices.length === 1 ? '' : 's'}? This action cannot be undone.`
      : `Are you sure you want to ${actionText} ${selectedServices.length} service${selectedServices.length === 1 ? '' : 's'}?`;

    if (!confirm(confirmMessage)) return;

    setBulkActionLoading(action);
    try {
      let successCount = 0;
      let errorCount = 0;

      // Process each selected service
      for (const serviceId of selectedServices) {
        try {
          let response;
          
          if (action === 'delete') {
            response = await ServiceService.deleteService(serviceId);
          } else {
            // For activate/deactivate, we need to update the service
            const service = services.find(s => s.id === serviceId);
            if (service) {
              const updatedService = {
                ...service,
                active: action === 'activate'
              };
              response = await ServiceService.updateService(serviceId, updatedService);
            }
          }

          if (response && !response.error) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
        }
      }

      // Show results
      if (successCount > 0) {
        const successMessage = action === 'delete' 
          ? `${successCount} service${successCount === 1 ? '' : 's'} deleted successfully`
          : `${successCount} service${successCount === 1 ? '' : 's'} ${actionText}d successfully`;
        
        showNotification('success', 'Bulk Action Completed', successMessage);
        refetch(); // Refresh the services list
      }

      if (errorCount > 0) {
        showNotification('error', 'Some Actions Failed', `${errorCount} service${errorCount === 1 ? '' : 's'} could not be ${actionText}d`);
      }

    } catch (error) {
      showNotification('error', 'Bulk Action Failed', `Failed to ${actionText} services. Please try again.`);
    } finally {
      setBulkActionLoading(null);
      setSelectedServices([]); // Clear selection
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'development':
        return <Icon icon="lucide:code" width={16} height={16} className="text-blue-500" />;
      case 'consulting':
        return <Icon icon="lucide:users" width={16} height={16} className="text-green-500" />;
      case 'design':
        return <Icon icon="lucide:palette" width={16} height={16} className="text-purple-500" />;
      case 'devops':
        return <Icon icon="lucide:settings" width={16} height={16} className="text-orange-500" />;
      default:
        return <Icon icon="lucide:briefcase" width={16} height={16} className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[rgb(var(--color-foreground))]">Services</h1>
        </div>
        <div className="text-center py-8">
          <p className="text-[rgb(var(--color-muted-foreground))]">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[rgb(var(--color-foreground))]">Services</h1>
        </div>
        <div className="text-center py-8">
          <p className="text-red-500">Error loading services: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          description={notification.description}
          onClose={hideNotification}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[rgb(var(--color-foreground))]">
            Services
          </h1>
          <p className="text-[rgb(var(--color-muted-foreground))] mt-1">
            Manage your service offerings and pricing
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
            to="/admin/services/new"
            className="flex items-center px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary))]/90 transition-colors"
          >
            <Icon icon="lucide:plus" width={16} height={16} className="mr-2" />
            New Service
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[rgb(var(--color-card))] p-4 rounded-lg border border-[rgb(var(--color-border))]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[rgb(var(--color-muted-foreground))]">Total Services</p>
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
              <p className="text-sm text-[rgb(var(--color-muted-foreground))]">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {loading ? '...' : services.filter(s => s.active).length}
              </p>
            </div>
            <Icon icon="lucide:check-circle" className="text-green-600" width={24} height={24} />
          </div>
        </div>
        <div className="bg-[rgb(var(--color-card))] p-4 rounded-lg border border-[rgb(var(--color-border))]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[rgb(var(--color-muted-foreground))]">Inactive</p>
              <p className="text-2xl font-bold text-red-600">
                {loading ? '...' : services.filter(s => !s.active).length}
              </p>
            </div>
            <Icon icon="lucide:x-circle" className="text-red-600" width={24} height={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-[rgb(var(--color-card))] p-6 rounded-lg border border-[rgb(var(--color-border))]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                Search
              </label>
              <div className="relative">
                <Icon icon="lucide:search" width={16} height={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[rgb(var(--color-muted-foreground))]" />
                <input
                  type="text"
                  placeholder="Search services..."
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
                <option value="development">Development</option>
                <option value="consulting">Consulting</option>
                <option value="design">Design</option>
                <option value="devops">DevOps</option>
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedServices.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800 dark:text-blue-200">
              {selectedServices.length} service{selectedServices.length === 1 ? '' : 's'} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction('activate')}
                disabled={bulkActionLoading !== null}
                className="inline-flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bulkActionLoading === 'activate' && (
                  <Icon icon="lucide:loader2" width={14} height={14} className="mr-1 animate-spin" />
                )}
                {bulkActionLoading === 'activate' ? 'Activating...' : 'Activate'}
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                disabled={bulkActionLoading !== null}
                className="inline-flex items-center px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bulkActionLoading === 'deactivate' && (
                  <Icon icon="lucide:loader2" width={14} height={14} className="mr-1 animate-spin" />
                )}
                {bulkActionLoading === 'deactivate' ? 'Deactivating...' : 'Deactivate'}
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                disabled={bulkActionLoading !== null}
                className="inline-flex items-center px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bulkActionLoading === 'delete' && (
                  <Icon icon="lucide:loader2" width={14} height={14} className="mr-1 animate-spin" />
                )}
                {bulkActionLoading === 'delete' ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Services Table */}
      <div className="bg-[rgb(var(--color-card))] rounded-lg border border-[rgb(var(--color-border))] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-[rgb(var(--color-muted))] border-b border-[rgb(var(--color-border))]">
              <tr>
                <th className="w-16 px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedServices.length === filteredServices.length && filteredServices.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-[rgb(var(--color-border))]"
                  />
                </th>
                <th className="w-80 px-6 py-4 text-left text-sm font-medium text-[rgb(var(--color-foreground))]">
                  Service
                </th>
                <th className="w-32 px-6 py-4 text-left text-sm font-medium text-[rgb(var(--color-foreground))]">
                  Category
                </th>
                <th className="w-24 px-6 py-4 text-left text-sm font-medium text-[rgb(var(--color-foreground))]">
                  Status
                </th>
                <th className="w-64 px-6 py-4 text-left text-sm font-medium text-[rgb(var(--color-foreground))]">
                  Features
                </th>
                <th className="w-48 px-6 py-4 text-left text-sm font-medium text-[rgb(var(--color-foreground))]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgb(var(--color-border))]">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-[rgb(var(--color-muted))] transition-colors">
                  <td className="px-6 py-5">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.id)}
                      onChange={() => handleSelectService(service.id)}
                      className="rounded border-[rgb(var(--color-border))]"
                    />
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] rounded-lg flex items-center justify-center">
                        {getCategoryIcon(service.category)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-base font-semibold text-[rgb(var(--color-foreground))] truncate">
                          {service.title}
                        </p>
                        <p className="text-sm text-[rgb(var(--color-muted-foreground))] line-clamp-2">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-3">
                      {getCategoryIcon(service.category)}
                      <span className="text-sm font-medium text-[rgb(var(--color-foreground))] capitalize">
                        {service.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      service.active 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {service.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1">
                      {service.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-[rgb(var(--color-muted))] text-[rgb(var(--color-foreground))] text-xs rounded-md"
                        >
                          {feature.length > 20 ? `${feature.substring(0, 20)}...` : feature}
                        </span>
                      ))}
                      {service.features.length > 3 && (
                        <span className="px-2 py-1 bg-[rgb(var(--color-muted))] text-[rgb(var(--color-muted-foreground))] text-xs rounded-md">
                          +{service.features.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/admin/services/${service.id}/edit`}
                        className="inline-flex items-center px-3 py-2 text-xs font-medium text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-primary))] border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))] rounded-md transition-all"
                        title="Edit Service"
                      >
                        <Icon icon="lucide:edit" width={14} height={14} className="mr-2" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteService(service.id, service.title)}
                        disabled={deletingId === service.id}
                        className="inline-flex items-center px-3 py-2 text-xs font-medium text-[rgb(var(--color-muted-foreground))] hover:text-red-600 border border-[rgb(var(--color-border))] hover:border-red-300 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete Service"
                      >
                        {deletingId === service.id ? (
                          <Icon icon="lucide:loader2" width={14} height={14} className="mr-2 animate-spin" />
                        ) : (
                          <Icon icon="lucide:trash2" width={14} height={14} className="mr-2" />
                        )}
                        {deletingId === service.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredServices.length === 0 && (
            <div className="p-12 text-center">
              <Icon icon="lucide:briefcase" width={48} height={48} className="mx-auto text-[rgb(var(--color-muted-foreground))] mb-4" />
              <h3 className="text-lg font-medium text-[rgb(var(--color-foreground))] mb-2">
                No services found
              </h3>
              <p className="text-[rgb(var(--color-muted-foreground))] mb-6">
                {filters.search || filters.category !== 'all' || filters.status !== 'all'
                  ? 'Try adjusting your filters to see more services.'
                  : 'Get started by creating your first service offering.'
                }
              </p>
              {(!filters.search && filters.category === 'all' && filters.status === 'all') && (
                <Link
                  to="/admin/services/new"
                  className="inline-flex items-center px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary))]/90 transition-colors"
                >
                  <Icon icon="lucide:plus" width={16} height={16} className="mr-2" />
                  Create First Service
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 