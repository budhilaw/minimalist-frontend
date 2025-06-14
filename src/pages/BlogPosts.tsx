import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { usePublishedPosts } from '../hooks/useBlog';
import { LoadingSection, ErrorMessage } from '../components/LoadingSpinner';
import { formatBlogDate } from '../utils/dateFormatter';
import { useDocumentTitle, useSocialMeta } from '../utils/seo';

export const BlogPosts: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  
  // Initialize filters from URL parameters
  useEffect(() => {
    const tagParam = searchParams.get('tag');
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    
    if (tagParam) setSelectedTag(tagParam);
    if (categoryParam) setSelectedCategory(categoryParam);
    if (searchParam) setSearchTerm(searchParam);
  }, [searchParams]);
  
  // Fetch published posts
  const { posts, loading, error } = usePublishedPosts({ limit: 100 }); // Get all posts for filtering

  // Redirect to home if no posts are available
  useEffect(() => {
    if (!loading && !error && posts.length === 0) {
      navigate('/', { replace: true });
    }
  }, [loading, error, posts.length, navigate]);

  // Get unique categories and tags from API data
  const categories = useMemo(() => {
    const cats = posts.map(post => post.category);
    return Array.from(new Set(cats));
  }, [posts]);

  const tags = useMemo(() => {
    const allTags = posts.flatMap(post => post.tags);
    return Array.from(new Set(allTags));
  }, [posts]);

  // Filter posts based on search and filters
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = searchTerm === '' || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === '' || post.category === selectedCategory;
      const matchesTag = selectedTag === '' || post.tags.includes(selectedTag);
      
      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [posts, searchTerm, selectedCategory, selectedTag]);

  // Update URL when filters change
  const updateURL = (newSearchTerm: string, newCategory: string, newTag: string) => {
    const params = new URLSearchParams();
    if (newSearchTerm) params.set('search', newSearchTerm);
    if (newCategory) params.set('category', newCategory);
    if (newTag) params.set('tag', newTag);
    
    setSearchParams(params);
  };

  // Handler functions that update both state and URL
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateURL(value, selectedCategory, selectedTag);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    updateURL(searchTerm, value, selectedTag);
  };

  const handleTagChange = (value: string) => {
    setSelectedTag(value);
    updateURL(searchTerm, selectedCategory, value);
  };

  const formatDate = (dateString: string) => {
    return formatBlogDate(dateString);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedTag('');
    setSearchParams(new URLSearchParams());
  };

  // SEO: Set page title for blog listing
  useDocumentTitle('Blog', 'Explore articles about software engineering, web development, and technology insights.');

  // SEO: Set social media meta tags for blog page
  useSocialMeta({
    title: 'Blog',
    description: 'Explore articles about software engineering, web development, and technology insights.',
    type: 'website'
  });

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-[rgb(var(--color-background))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <LoadingSection message="Loading blog posts..." />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen pt-16 bg-[rgb(var(--color-background))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ErrorMessage message={error} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-[rgb(var(--color-background))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-[rgb(var(--color-foreground))] sm:text-5xl">
            Blog Posts
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-[rgb(var(--color-muted-foreground))]">
            Insights, tutorials, and thoughts on software development and technology
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="bg-[rgb(var(--color-muted))] p-6 rounded-lg border border-[rgb(var(--color-border))]">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Icon icon="lucide:search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[rgb(var(--color-muted-foreground))] w-5 h-5" />
              <input
                type="text"
                placeholder="Search posts, tags, or content..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent transition-colors duration-200"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent transition-colors duration-200"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Tag Filter */}
              <div>
                <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                  Tag
                </label>
                <select
                  value={selectedTag}
                  onChange={(e) => handleTagChange(e.target.value)}
                  className="w-full px-3 py-2 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent transition-colors duration-200"
                >
                  <option value="">All Tags</option>
                  {tags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 text-sm font-medium text-[rgb(var(--color-muted-foreground))] bg-transparent border border-[rgb(var(--color-border))] rounded-md hover:bg-[rgb(var(--color-background))] transition-colors duration-200"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-[rgb(var(--color-muted-foreground))]">
              Showing {filteredPosts.length} of {posts.length} posts
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-[rgb(var(--color-background))] rounded-lg border border-[rgb(var(--color-border))] overflow-hidden hover:border-[rgb(var(--color-primary))] transition-all duration-300 hover:shadow-lg group"
              >
                {/* Featured Image */}
                {post.featured_image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.featured_image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* Featured Badge */}
                  {post.featured && (
                    <div className="mb-4">
                      <span className="px-3 py-1 bg-[rgb(var(--color-primary))] text-white text-sm font-medium rounded-full">
                        Featured
                      </span>
                    </div>
                  )}

                {/* Category */}
                <div className="mb-4">
                  <span className="px-3 py-1 bg-[rgb(var(--color-muted))] text-[rgb(var(--color-foreground))] text-sm rounded-full">
                    {post.category}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-[rgb(var(--color-foreground))] mb-3 group-hover:text-[rgb(var(--color-primary))] transition-colors duration-200">
                  <Link to={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                {/* Excerpt */}
                <p className="text-[rgb(var(--color-muted-foreground))] mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between mb-4 text-sm text-[rgb(var(--color-muted-foreground))]">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Icon icon="lucide:calendar" width={14} height={14} className="mr-1" />
                      {formatDate(post.published_at || post.created_at)}
                    </div>
                    <div className="flex items-center">
                      <Icon icon="lucide:clock" width={14} height={14} className="mr-1" />
                      {Math.ceil(post.content.split(' ').length / 200)} min read
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleTagChange(tag)}
                      className="px-2 py-1 bg-[rgb(var(--color-muted))] text-[rgb(var(--color-foreground))] text-xs rounded hover:bg-[rgb(var(--color-primary))] hover:text-white transition-colors duration-200"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>

                {/* Read More Link */}
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary))]/80 font-medium transition-colors duration-200"
                >
                  Read More
                  <Icon icon="lucide:arrow-right" width={14} height={14} className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* No Results */
          <div className="text-center py-12">
            <Icon icon="lucide:tag" width={48} height={48} className="mx-auto text-[rgb(var(--color-muted-foreground))] mb-4" />
            <h3 className="text-xl font-semibold text-[rgb(var(--color-foreground))] mb-2">
              No posts found
            </h3>
            <p className="text-[rgb(var(--color-muted-foreground))] mb-6">
              Try adjusting your search terms or filters
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary))]/90 transition-colors duration-200"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-[rgb(var(--color-border))] text-base font-medium rounded-md text-[rgb(var(--color-foreground))] bg-[rgb(var(--color-background))] hover:bg-[rgb(var(--color-muted))] transition-colors duration-200"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}; 