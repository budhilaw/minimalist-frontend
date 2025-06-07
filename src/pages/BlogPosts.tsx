import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Search, Tag, ArrowRight } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';

export const BlogPosts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  // Get unique categories and tags
  const categories = useMemo(() => {
    const cats = blogPosts.map(post => post.category);
    return Array.from(new Set(cats));
  }, []);

  const tags = useMemo(() => {
    const allTags = blogPosts.flatMap(post => post.tags);
    return Array.from(new Set(allTags));
  }, []);

  // Filter posts based on search and filters
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = searchTerm === '' || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === '' || post.category === selectedCategory;
      const matchesTag = selectedTag === '' || post.tags.includes(selectedTag);
      
      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [searchTerm, selectedCategory, selectedTag]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedTag('');
  };

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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[rgb(var(--color-muted-foreground))] w-5 h-5" />
              <input
                type="text"
                placeholder="Search posts, tags, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                  onChange={(e) => setSelectedCategory(e.target.value)}
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
                  onChange={(e) => setSelectedTag(e.target.value)}
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
              Showing {filteredPosts.length} of {blogPosts.length} posts
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-[rgb(var(--color-background))] rounded-lg border border-[rgb(var(--color-border))] p-6 hover:border-[rgb(var(--color-primary))] transition-all duration-300 hover:shadow-lg group"
              >
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
                  <Link to={`/blog/${post.id}`}>
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
                      <Calendar size={14} className="mr-1" />
                      {formatDate(post.publishDate)}
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedTag(tag)}
                      className="px-2 py-1 bg-[rgb(var(--color-muted))] text-[rgb(var(--color-foreground))] text-xs rounded hover:bg-[rgb(var(--color-primary))] hover:text-white transition-colors duration-200"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>

                {/* Read More Link */}
                <Link
                  to={`/blog/${post.id}`}
                  className="inline-flex items-center text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary))]/80 font-medium transition-colors duration-200"
                >
                  Read More
                  <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </article>
            ))}
          </div>
        ) : (
          /* No Results */
          <div className="text-center py-12">
            <Tag size={48} className="mx-auto text-[rgb(var(--color-muted-foreground))] mb-4" />
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