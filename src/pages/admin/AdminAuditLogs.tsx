import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { AuditLog, AuditService, AuditAction, ResourceType } from '../../data/auditLogs';
import { formatAuditTimestamp } from '../../utils/dateFormatter';

const AdminAuditLogs: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    action: '' as AuditAction | '',
    resourceType: '' as ResourceType | '',
    success: '' as 'true' | 'false' | '',
    search: ''
  });
  const [sortBy, setSortBy] = useState<'timestamp' | 'action' | 'resourceType'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  
  const itemsPerPage = 20;

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const auditService = AuditService.getInstance();
      const response = await auditService.getAllLogs({
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        action: filters.action || undefined,
        resourceType: filters.resourceType || undefined,
        success: filters.success ? filters.success === 'true' : undefined,
        search: filters.search || undefined,
        page: currentPage,
        limit: itemsPerPage
      });
      setAuditLogs(response.logs);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    setCurrentPage(1);
    await loadAuditLogs();
  };

  const clearFilters = async () => {
    setFilters({
      startDate: '',
      endDate: '',
      action: '',
      resourceType: '',
      success: '',
      search: ''
    });
    setCurrentPage(1);
  };

  const sortedLogs = [...auditLogs].sort((a, b) => {
    let compareValue = 0;
    
    switch (sortBy) {
      case 'timestamp':
        compareValue = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        break;
      case 'action':
        compareValue = a.action.localeCompare(b.action);
        break;
      case 'resourceType':
        compareValue = a.resourceType.localeCompare(b.resourceType);
        break;
    }
    
    return sortOrder === 'asc' ? compareValue : -compareValue;
  });

  const paginatedLogs = sortedLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedLogs.length / itemsPerPage);

  const getStatusIcon = (success: boolean) => {
    return success 
      ? <Icon icon="lucide:check-circle" className="text-green-500" />
      : <Icon icon="lucide:x-circle" className="text-red-500" />;
  };

  const getActionIcon = (action: AuditAction) => {
    const iconMap: Record<string, string> = {
      login: 'lucide:log-in',
      logout: 'lucide:log-out',
      login_failed: 'lucide:shield-x',
      post_created: 'lucide:file-plus',
      post_updated: 'lucide:file-edit',
      post_deleted: 'lucide:file-minus',
      post_published: 'lucide:eye',
      post_unpublished: 'lucide:eye-off',
      portfolio_created: 'lucide:folder-plus',
      portfolio_updated: 'lucide:folder-edit',
      portfolio_deleted: 'lucide:folder-minus',
      service_created: 'lucide:plus-circle',
      service_updated: 'lucide:edit-3',
      service_deleted: 'lucide:minus-circle',
      comment_approved: 'lucide:message-circle-check',
      comment_rejected: 'lucide:message-circle-x',
      comment_deleted: 'lucide:message-circle-minus',
      settings_updated: 'lucide:settings',
      profile_updated: 'lucide:user-check'
    };
    
    return iconMap[action] || 'lucide:activity';
  };

  const formatTimestamp = (timestamp: string) => {
    return formatAuditTimestamp(timestamp);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Logs</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track all administrative actions and system events
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {auditLogs.length} total logs
          </span>
          <button
            onClick={loadAuditLogs}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Icon icon="lucide:refresh-cw" className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Action
            </label>
            <select
              value={filters.action}
              onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value as AuditAction }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Actions</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
              <option value="post_created">Post Created</option>
              <option value="post_updated">Post Updated</option>
              <option value="post_deleted">Post Deleted</option>
              <option value="portfolio_created">Portfolio Created</option>
              <option value="service_created">Service Created</option>
              <option value="settings_updated">Settings Updated</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Resource Type
            </label>
            <select
              value={filters.resourceType}
              onChange={(e) => setFilters(prev => ({ ...prev, resourceType: e.target.value as ResourceType }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Types</option>
              <option value="authentication">Authentication</option>
              <option value="post">Post</option>
              <option value="portfolio">Portfolio</option>
              <option value="service">Service</option>
              <option value="comment">Comment</option>
              <option value="settings">Settings</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={filters.success}
              onChange={(e) => setFilters(prev => ({ ...prev, success: e.target.value as 'true' | 'false' }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="true">Success</option>
              <option value="false">Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search logs..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Clear Filters
          </button>
          <button
            onClick={applyFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Audit Trail</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                >
                  <option value="timestamp">Timestamp</option>
                  <option value="action">Action</option>
                  <option value="resourceType">Resource Type</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <Icon icon={sortOrder === 'asc' ? 'lucide:arrow-up' : 'lucide:arrow-down'} className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex justify-center items-center space-x-2">
                      <Icon icon="lucide:loader-2" className="w-6 h-6 animate-spin text-blue-600" />
                      <span className="text-gray-500 dark:text-gray-400">Loading audit logs...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      <Icon icon="lucide:search-x" className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No audit logs found</p>
                      <p>Try adjusting your filters or date range</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(log.success)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <Icon icon={getActionIcon(log.action)} className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {AuditService.getActionDisplayName(log.action)}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {AuditService.getResourceTypeDisplayName(log.resourceType)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {log.resourceTitle || log.resourceId || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{log.userName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{log.ipAddress}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatTimestamp(log.timestamp)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {log.details}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedLogs.length)} of {sortedLogs.length} logs
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Audit Log Details
                </h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Icon icon="lucide:x" className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ID</label>
                  <p className="text-sm text-gray-900 dark:text-white font-mono">{selectedLog.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedLog.success)}
                    <span className={`text-sm font-medium ${selectedLog.success ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedLog.success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Action</label>
                  <p className="text-sm text-gray-900 dark:text-white">{AuditService.getActionDisplayName(selectedLog.action)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Resource Type</label>
                  <p className="text-sm text-gray-900 dark:text-white">{AuditService.getResourceTypeDisplayName(selectedLog.resourceType)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">User</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedLog.userName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Timestamp</label>
                  <p className="text-sm text-gray-900 dark:text-white">{formatTimestamp(selectedLog.timestamp)}</p>
                </div>
                {selectedLog.resourceId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Resource ID</label>
                    <p className="text-sm text-gray-900 dark:text-white font-mono">{selectedLog.resourceId}</p>
                  </div>
                )}
                {selectedLog.resourceTitle && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Resource Title</label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedLog.resourceTitle}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">IP Address</label>
                  <p className="text-sm text-gray-900 dark:text-white font-mono">{selectedLog.ipAddress}</p>
                </div>
                {selectedLog.errorMessage && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Error Message</label>
                    <p className="text-sm text-red-600 dark:text-red-400">{selectedLog.errorMessage}</p>
                  </div>
                )}
              </div>
              {selectedLog.details && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Details</label>
                  <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    {selectedLog.details}
                  </p>
                </div>
              )}
              {selectedLog.userAgent && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">User Agent</label>
                  <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg font-mono break-all">
                    {selectedLog.userAgent}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAuditLogs; 