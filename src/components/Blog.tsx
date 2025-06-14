import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { usePublishedPosts, useFeaturedPosts } from '../hooks/useBlog';
import { LoadingSection, ErrorMessage } from './LoadingSpinner';
import { formatBlogDate } from '../utils/dateFormatter';

export const Blog: React.FC = () => {
  // Fetch published posts for the regular posts section
  const { posts: publishedPosts, loading, error } = usePublishedPosts({ limit: 6 });
  
  // Fetch featured posts for the featured section
  const { 
    posts: featuredPosts, 
    loading: featuredLoading, 
    error: featuredError 
  } = useFeaturedPosts();

  const formatDate = (dateString: string) => {
    return formatBlogDate(dateString);
  };

  // Helper function to calculate read time
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  // Hide section if no posts at all and not loading
  const hasAnyPosts = publishedPosts.length > 0 || featuredPosts.length > 0;
  const isLoading = loading || featuredLoading;
  
  if (!isLoading && !hasAnyPosts && !error && !featuredError) {
    return null;
  }

  return (
    <section id="blog" className="py-20 bg-[rgb(var(--color-muted))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-[rgb(var(--color-foreground))] sm:text-4xl">
            Latest Blog Posts
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-[rgb(var(--color-muted-foreground))]">
            Insights, tutorials, and thoughts on software development and technology
          </p>
        </div>

        {/* Featured Post */}
        {featuredLoading ? (
          <LoadingSection message="Loading featured posts..." />
        ) : featuredError ? (
          <ErrorMessage message={featuredError} />
        ) : featuredPosts.length > 0 ? (
          featuredPosts.slice(0, 1).map((post, index) => (
          <div key={index} className="mb-12">
            <div className="bg-[rgb(var(--color-background))] rounded-lg border border-[rgb(var(--color-border))] overflow-hidden hover:border-[rgb(var(--color-primary))] transition-colors duration-300">
              <div className="lg:grid lg:grid-cols-2">
                {/* Featured Image */}
                <div className="h-64 lg:h-auto bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] flex items-center justify-center overflow-hidden">
                  {post.featured_image ? (
                    <img 
                      src={post.featured_image} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-white">
                      <Icon icon="lucide:tag" width={48} height={48} className="mx-auto mb-4 opacity-80" />
                      <p className="text-lg font-medium">Featured Article</p>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-8 lg:p-12">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="px-3 py-1 bg-[rgb(var(--color-primary))] text-white text-sm font-medium rounded-full">
                      Featured
                    </span>
                    <span className="px-3 py-1 bg-[rgb(var(--color-muted))] text-[rgb(var(--color-foreground))] text-sm rounded-full">
                      {post.category}
                    </span>
                  </div>
                  
                  <Link to={`/blog/${post.slug}`}>
                    <h3 className="text-2xl font-bold text-[rgb(var(--color-foreground))] mb-4 hover:text-[rgb(var(--color-primary))] transition-colors duration-200 cursor-pointer">
                      {post.title}
                    </h3>
                  </Link>
                  
                  <p className="text-[rgb(var(--color-muted-foreground))] mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-[rgb(var(--color-muted-foreground))]">
                      <div className="flex items-center">
                        <Icon icon="lucide:calendar" width={16} height={16} className="mr-2" />
                        {formatDate(post.published_at || post.created_at)}
                      </div>
                      <div className="flex items-center">
                        <Icon icon="lucide:clock" width={16} height={16} className="mr-2" />
                        {calculateReadTime(post.content)}
                      </div>
                    </div>
                    
                    <Link
                       to={`/blog/${post.slug}`}
                       className="inline-flex items-center text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary))]/80 font-medium transition-colors duration-200"
                     >
                       Read More
                       <Icon icon="lucide:arrow-right" width={16} height={16} className="ml-2" />
                     </Link>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-6">
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-[rgb(var(--color-muted))] text-[rgb(var(--color-foreground))] text-xs rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
        ) : (
          <div className="text-center py-8">
            <p className="text-[rgb(var(--color-muted-foreground))]">No featured posts available.</p>
          </div>
        )}

        {/* Regular Posts Grid */}
        {loading ? (
          <LoadingSection message="Loading posts..." />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : publishedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {publishedPosts.filter(post => !post.featured).map((post, index) => (
            <article
              key={index}
              className="bg-[rgb(var(--color-background))] rounded-lg border border-[rgb(var(--color-border))] overflow-hidden hover:border-[rgb(var(--color-primary))] transition-all duration-300 hover:shadow-lg"
            >
              {/* Featured Image */}
              {post.featured_image && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.featured_image} 
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              
              <div className="p-6">
                {/* Category */}
                <div className="mb-4">
                  <span className="px-3 py-1 bg-[rgb(var(--color-muted))] text-[rgb(var(--color-foreground))] text-sm rounded-full">
                    {post.category}
                  </span>
                </div>
              
              {/* Title */}
              <Link to={`/blog/${post.slug}`}>
                <h3 className="text-xl font-bold text-[rgb(var(--color-foreground))] mb-3 line-clamp-2 hover:text-[rgb(var(--color-primary))] transition-colors duration-200 cursor-pointer">
                  {post.title}
                </h3>
              </Link>
              
              {/* Excerpt */}
              <p className="text-[rgb(var(--color-muted-foreground))] mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              
              {/* Meta Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-[rgb(var(--color-muted-foreground))]">
                  <div className="flex items-center">
                    <Icon icon="lucide:calendar" width={14} height={14} className="mr-1" />
                    {formatDate(post.published_at || post.created_at)}
                  </div>
                  <div className="flex items-center">
                    <Icon icon="lucide:clock" width={14} height={14} className="mr-1" />
                    {calculateReadTime(post.content)}
                  </div>
                </div>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-[rgb(var(--color-muted))] text-[rgb(var(--color-foreground))] text-xs rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              
              {/* Read More Link */}
               <Link
                 to={`/blog/${post.slug}`}
                 className="inline-flex items-center text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary))]/80 font-medium transition-colors duration-200"
               >
                 Read More
                 <Icon icon="lucide:arrow-right" width={14} height={14} className="ml-2" />
               </Link>
              </div>
            </article>
          ))}
        </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-[rgb(var(--color-muted-foreground))]">No posts available.</p>
          </div>
        )}

        {/* View All Posts CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center px-8 py-3 border border-[rgb(var(--color-border))] text-base font-medium rounded-md text-[rgb(var(--color-foreground))] bg-[rgb(var(--color-background))] hover:bg-[rgb(var(--color-muted))] transition-colors duration-200"
          >
            View All Posts
            <Icon icon="lucide:arrow-right" width={16} height={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}; 