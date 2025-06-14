import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { blogPosts } from '../../data/blogPosts';
import { formatTableDate } from '../../utils/dateFormatter';

interface PostFilters {
  search: string;
  category: string;
  status: 'all' | 'published' | 'draft';
  featured: 'all' | 'featured' | 'normal';
}

export const AdminPosts: React.FC = () => {
  const [filters, setFilters] = useState<PostFilters>({
    search: '',
    category: 'all',
    status: 'all',
    featured: 'all'
  });
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories for filter dropdown
  const categories = useMemo(() => {
    const allCategories = blogPosts.map(post => post.category);
    return ['all', ...Array.from(new Set(allCategories))];
  }, []);

  // Filter posts based on current filters
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(filters.search.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));
      
      const matchesCategory = filters.category === 'all' || post.category === filters.category;
      
      // For demo purposes, treating all posts as published
      const matchesStatus = filters.status === 'all' || filters.status === 'published';
      
      const matchesFeatured = filters.featured === 'all' || 
                             (filters.featured === 'featured' && post.featured) ||
                             (filters.featured === 'normal' && !post.featured);

      return matchesSearch && matchesCategory && matchesStatus && matchesFeatured;
    });
  }, [filters]);

  const handleSelectPost = (postId: string) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts.map(post => post.id));
    }
  };

  const formatDate = (dateString: string) => {
    return formatTableDate(dateString);
  };

  const handleBulkAction = (action: string) => {
    // Handle bulk actions (implement API calls)
    setSelectedPosts([]);
  };

  const handleDeletePost = (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      console.log('Delete post:', postId);
      // In real app, this would make an API call
    }
  };

  const handleDuplicatePost = (postId: string) => {
    console.log('Duplicate post:', postId);
    // In real app, this would create a copy of the post
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[rgb(var(--color-foreground))]">
            Blog Posts
          </h1>
          <p className="text-[rgb(var(--color-muted-foreground))] mt-1">
            Manage your blog posts, categories, and publishing settings
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
            to="/admin/posts/new"
            className="flex items-center px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary))]/90 transition-colors"
          >
            <Icon icon="lucide:plus" width={16} height={16} className="mr-2" />
            New Post
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[rgb(var(--color-card))] p-4 rounded-lg border border-[rgb(var(--color-border))]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[rgb(var(--color-muted-foreground))]">Total Posts</p>
              <p className="text-2xl font-bold text-[rgb(var(--color-foreground))]">{blogPosts.length}</p>
            </div>
            <Icon icon="lucide:file-text" className="text-[rgb(var(--color-primary))]" width={24} height={24} />
          </div>
        </div>
        <div className="bg-[rgb(var(--color-card))] p-4 rounded-lg border border-[rgb(var(--color-border))]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[rgb(var(--color-muted-foreground))]">Published</p>
              <p className="text-2xl font-bold text-green-600">{blogPosts.length}</p>
            </div>
            <Icon icon="lucide:eye" className="text-green-600" width={24} height={24} />
          </div>
        </div>
        <div className="bg-[rgb(var(--color-card))] p-4 rounded-lg border border-[rgb(var(--color-border))]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[rgb(var(--color-muted-foreground))]">Drafts</p>
              <p className="text-2xl font-bold text-orange-600">0</p>
            </div>
            <Icon icon="lucide:edit" className="text-orange-600" width={24} height={24} />
          </div>
        </div>
        <div className="bg-[rgb(var(--color-card))] p-4 rounded-lg border border-[rgb(var(--color-border))]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[rgb(var(--color-muted-foreground))]">Featured</p>
              <p className="text-2xl font-bold text-purple-600">
                {blogPosts.filter(post => post.featured).length}
              </p>
            </div>
            <Icon icon="lucide:star" className="text-purple-600" width={24} height={24} />
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
                  placeholder="Search posts..."
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
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                Featured
              </label>
              <select
                value={filters.featured}
                onChange={(e) => setFilters(prev => ({ ...prev, featured: e.target.value as any }))}
                className="w-full px-3 py-2 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
              >
                <option value="all">All Posts</option>
                <option value="featured">Featured Only</option>
                <option value="normal">Non-Featured</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800 dark:text-blue-200">
              {selectedPosts.length} post{selectedPosts.length === 1 ? '' : 's'} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction('publish')}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Publish
              </button>
              <button
                onClick={() => handleBulkAction('unpublish')}
                className="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
              >
                Unpublish
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

      {/* Posts Table */}
      <div className="bg-[rgb(var(--color-card))] rounded-lg border border-[rgb(var(--color-border))] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full admin-posts-table">
            <thead className="bg-[rgb(var(--color-muted))] border-b border-[rgb(var(--color-border))]">
              <tr>
                <th className="w-12 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-[rgb(var(--color-border))]"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[rgb(var(--color-foreground))]">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[rgb(var(--color-foreground))]">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[rgb(var(--color-foreground))]">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[rgb(var(--color-foreground))]">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[rgb(var(--color-foreground))]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgb(var(--color-border))]">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-[rgb(var(--color-muted))] transition-colors">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedPosts.includes(post.id)}
                      onChange={() => handleSelectPost(post.id)}
                      className="rounded border-[rgb(var(--color-border))]"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-medium text-[rgb(var(--color-foreground))] truncate">
                            {post.title}
                          </h3>
                          {post.featured && (
                            <Icon icon="lucide:star" width={14} height={14} className="text-yellow-500 fill-current" />
                          )}
                        </div>
                        <p className="text-sm text-[rgb(var(--color-muted-foreground))] truncate mt-1">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center text-xs text-[rgb(var(--color-muted-foreground))]">
                            <Icon icon="lucide:user" width={12} height={12} className="mr-1" />
                            {post.author.name}
                          </div>
                          <div className="flex items-center text-xs text-[rgb(var(--color-muted-foreground))]">
                            <Icon icon="lucide:clock" width={12} height={12} className="mr-1" />
                            {post.readTime}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[rgb(var(--color-muted))] text-[rgb(var(--color-foreground))]">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Published
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center text-sm text-[rgb(var(--color-muted-foreground))]">
                      <Icon icon="lucide:calendar" width={12} height={12} className="mr-1" />
                      {formatDate(post.publishDate)}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2 admin-posts-actions">
                      <Link
                        to={`/blog/${post.id}`}
                        target="_blank"
                        className="inline-flex items-center px-2 py-1 text-xs text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-primary))] border border-transparent hover:border-[rgb(var(--color-border))] rounded transition-colors"
                        title="View Post"
                      >
                        <Icon icon="lucide:eye" width={14} height={14} className="mr-1" />
                        View
                      </Link>
                      <Link
                        to={`/admin/posts/${post.id}/edit`}
                        className="inline-flex items-center px-2 py-1 text-xs bg-[rgb(var(--color-primary))] text-white hover:bg-[rgb(var(--color-primary))]/90 rounded transition-colors"
                        title="Edit Post"
                      >
                        <Icon icon="lucide:edit" width={14} height={14} className="mr-1" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDuplicatePost(post.id)}
                        className="inline-flex items-center px-2 py-1 text-xs text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-primary))] border border-transparent hover:border-[rgb(var(--color-border))] rounded transition-colors"
                        title="Duplicate Post"
                      >
                        <Icon icon="lucide:copy" width={14} height={14} className="mr-1" />
                        Copy
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="inline-flex items-center px-2 py-1 text-xs text-[rgb(var(--color-muted-foreground))] hover:text-red-600 border border-transparent hover:border-red-200 rounded transition-colors"
                        title="Delete Post"
                      >
                        <Icon icon="lucide:trash2" width={14} height={14} className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <Icon icon="lucide:file-text" width={48} height={48} className="mx-auto text-[rgb(var(--color-muted-foreground))] mb-4" />
            <h3 className="text-lg font-medium text-[rgb(var(--color-foreground))] mb-2">
              No posts found
            </h3>
            <p className="text-[rgb(var(--color-muted-foreground))] mb-4">
              {filters.search || filters.category !== 'all' || filters.status !== 'all' || filters.featured !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'Get started by creating your first blog post.'
              }
            </p>
            {(!filters.search && filters.category === 'all' && filters.status === 'all' && filters.featured === 'all') && (
              <Link
                to="/admin/posts/new"
                className="inline-flex items-center px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary))]/90 transition-colors"
              >
                <Icon icon="lucide:plus" width={16} height={16} className="mr-2" />
                Create Your First Post
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 