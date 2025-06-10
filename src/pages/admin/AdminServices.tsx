import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { services, iconMap, Service } from '../../data/services';

export const AdminServices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [serviceList, setServiceList] = useState<Service[]>(services);

  // Filter services
  const filteredServices = serviceList.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && service.active) ||
                         (selectedStatus === 'inactive' && !service.active) ||
                         (selectedStatus === 'featured' && service.featured);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Statistics
  const stats = {
    total: serviceList.length,
    active: serviceList.filter(s => s.active).length,
    featured: serviceList.filter(s => s.featured).length,
    inactive: serviceList.filter(s => !s.active).length
  };

  // Toggle service status
  const toggleServiceStatus = (id: string, field: 'active' | 'featured') => {
    setServiceList(prev => prev.map(service => 
      service.id === id 
        ? { ...service, [field]: !service[field], updatedAt: new Date().toISOString() }
        : service
    ));
  };

  // Delete service
  const deleteService = (id: string) => {
    if (window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      setServiceList(prev => prev.filter(service => service.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[rgb(var(--color-foreground))]">
            Services Management
          </h1>
          <p className="text-[rgb(var(--color-muted-foreground))] mt-1">
            Manage your services, pricing, and offerings
          </p>
        </div>
        <Link
          to="/admin/services/new"
          className="flex items-center px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary))]/90 transition-colors"
        >
          <Icon icon="lucide:plus" width={16} height={16} className="mr-2" />
          New Service
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[rgb(var(--color-card))] p-6 rounded-lg border border-[rgb(var(--color-border))]">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Icon icon="lucide:bar-chart3" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-[rgb(var(--color-muted-foreground))]">Total Services</p>
              <p className="text-2xl font-bold text-[rgb(var(--color-foreground))]">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-[rgb(var(--color-card))] p-6 rounded-lg border border-[rgb(var(--color-border))]">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Icon icon="lucide:eye" className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-[rgb(var(--color-muted-foreground))]">Active Services</p>
              <p className="text-2xl font-bold text-[rgb(var(--color-foreground))]">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-[rgb(var(--color-card))] p-6 rounded-lg border border-[rgb(var(--color-border))]">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Icon icon="lucide:star" className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-[rgb(var(--color-muted-foreground))]">Featured</p>
              <p className="text-2xl font-bold text-[rgb(var(--color-foreground))]">{stats.featured}</p>
            </div>
          </div>
        </div>

        <div className="bg-[rgb(var(--color-card))] p-6 rounded-lg border border-[rgb(var(--color-border))]">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <Icon icon="lucide:eye-off" className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-[rgb(var(--color-muted-foreground))]">Inactive</p>
              <p className="text-2xl font-bold text-[rgb(var(--color-foreground))]">{stats.inactive}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[rgb(var(--color-card))] p-6 rounded-lg border border-[rgb(var(--color-border))]">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Icon icon="lucide:search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[rgb(var(--color-muted-foreground))] w-4 h-4" />
              <input
                type="text"
                placeholder="Search services..."
                className="w-full pl-10 pr-4 py-2 border border-[rgb(var(--color-border))] rounded-md focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="lg:w-48">
            <select
              className="w-full px-3 py-2 border border-[rgb(var(--color-border))] rounded-md focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="development">Development</option>
              <option value="consulting">Consulting</option>
              <option value="design">Design</option>
              <option value="devops">DevOps</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="lg:w-48">
            <select
              className="w-full px-3 py-2 border border-[rgb(var(--color-border))] rounded-md focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="featured">Featured</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-[rgb(var(--color-card))] rounded-lg border border-[rgb(var(--color-border))] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: '1000px' }}>
            <thead className="bg-[rgb(var(--color-muted))] border-b border-[rgb(var(--color-border))]">
              <tr>
                <th className="px-6 py-5 text-left text-sm font-medium text-[rgb(var(--color-foreground))]" style={{ minWidth: '450px' }}>
                  Service
                </th>
                <th className="px-4 py-5 text-left text-sm font-medium text-[rgb(var(--color-foreground))]" style={{ minWidth: '160px' }}>
                  Category
                </th>
                <th className="px-4 py-5 text-left text-sm font-medium text-[rgb(var(--color-foreground))]" style={{ minWidth: '160px' }}>
                  Status
                </th>
                <th className="px-4 py-5 text-left text-sm font-medium text-[rgb(var(--color-foreground))]" style={{ minWidth: '160px' }}>
                  Featured
                </th>
                <th className="px-4 py-5 text-left text-sm font-medium text-[rgb(var(--color-foreground))]" style={{ minWidth: '300px' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgb(var(--color-border))]">
              {filteredServices.map((service) => {
                const iconName = iconMap[service.icon] || iconMap.code;
                return (
                  <tr key={service.id} className="hover:bg-[rgb(var(--color-muted))]/50">
                    <td className="px-6 py-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-[rgb(var(--color-primary))] rounded-lg flex items-center justify-center">
                            <Icon icon={iconName} className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-[rgb(var(--color-foreground))] mb-1">
                            {service.title}
                          </h3>
                          <p className="text-sm text-[rgb(var(--color-muted-foreground))] line-clamp-2 leading-relaxed mb-2">
                            {service.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {service.features.slice(0, 2).map((feature, idx) => (
                              <span
                                key={idx}
                                className="inline-block px-2 py-1 text-xs bg-[rgb(var(--color-muted))] text-[rgb(var(--color-muted-foreground))] rounded"
                              >
                                {feature.length > 25 ? `${feature.substring(0, 25)}...` : feature}
                              </span>
                            ))}
                            {service.features.length > 2 && (
                              <span className="inline-block px-2 py-1 text-xs bg-[rgb(var(--color-accent))] text-[rgb(var(--color-accent-foreground))] rounded font-medium">
                                +{service.features.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-6">
                      <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full capitalize bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {service.category}
                      </span>
                    </td>
                    <td className="px-4 py-6">
                      <button
                        onClick={() => toggleServiceStatus(service.id, 'active')}
                        className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full transition-colors border ${
                          service.active
                            ? 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                            : 'bg-red-100 text-red-800 hover:bg-red-200 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                        }`}
                      >
                        {service.active ? <Icon icon="lucide:eye" className="w-3 h-3 mr-1" /> : <Icon icon="lucide:eye-off" className="w-3 h-3 mr-1" />}
                        {service.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-6">
                      <button
                        onClick={() => toggleServiceStatus(service.id, 'featured')}
                        className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full transition-colors border ${
                          service.featured
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800'
                        }`}
                      >
                        {service.featured ? <Icon icon="lucide:star" className="w-3 h-3 mr-1" /> : <Icon icon="lucide:star-off" className="w-3 h-3 mr-1" />}
                        {service.featured ? 'Featured' : 'Regular'}
                      </button>
                    </td>
                    <td className="px-4 py-6">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/admin/services/edit/${service.id}`}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/50"
                        >
                          <Icon icon="lucide:edit" className="w-4 h-4 mr-1" />
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteService(service.id)}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors dark:bg-red-900/30 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/50"
                        >
                          <Icon icon="lucide:trash2" className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-[rgb(var(--color-muted-foreground))] mb-4">
              No services found matching your criteria.
            </div>
            <Link
              to="/admin/services/new"
              className="inline-flex items-center px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary))]/90 transition-colors"
            >
              <Icon icon="lucide:plus" width={16} height={16} className="mr-2" />
              Create New Service
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}; 