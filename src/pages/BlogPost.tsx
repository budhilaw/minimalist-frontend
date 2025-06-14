import React from 'react';
import { useParams, Link, Navigate, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useSinglePost, usePublishedPosts } from '../hooks/useBlog';
import { CommentSection } from '../components/comments';
import { LoadingSpinner, ErrorMessage } from '../components/LoadingSpinner';
import { formatBlogDate } from '../utils/dateFormatter';
import { useDocumentTitle, useSocialMeta, useStructuredData, generateArticleStructuredData } from '../utils/seo';
import { Breadcrumb, useBreadcrumbs } from '../components/Breadcrumb';
import { OptimizedImage } from '../components/OptimizedImage';

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  
  // Fetch single post
  const { post, loading, error } = useSinglePost(slug);
  
  // Fetch all published posts for related posts and navigation
  const { posts: allPosts } = usePublishedPosts({ limit: 100 });

  // Generate breadcrumbs
  const breadcrumbs = useBreadcrumbs(location.pathname, post?.title);

  // SEO: Set document title and meta description for blog posts
  useDocumentTitle(
    post?.title, // This will create "Site Title | Post Title"
    post?.excerpt // Use post excerpt as meta description
  );

  // SEO: Set social media meta tags
  useSocialMeta({
    title: post?.title,
    description: post?.excerpt,
    image: post?.featured_image,
    url: window.location.href,
    type: 'article'
  });

  // SEO: Add structured data for the article
  useStructuredData(
    post ? generateArticleStructuredData({
      title: post.title,
      description: post.excerpt || post.title, // Fallback to title if no excerpt
      author: 'Ericsson Budhilaw', // You can make this dynamic
      publishedDate: post.published_at || post.created_at,
      modifiedDate: post.updated_at,
      image: post.featured_image,
      url: window.location.href
    }) : {}
  );

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-[rgb(var(--color-background))] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen pt-16 bg-[rgb(var(--color-background))]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ErrorMessage message={error} />
          <div className="mt-8 text-center">
            <Link
              to="/blog"
              className="inline-flex items-center text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary))]/80"
            >
              <Icon icon="lucide:arrow-left" width={16} height={16} className="mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Handle post not found
  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  // Get related posts (same category, excluding current post)
  const relatedPosts = allPosts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    return formatBlogDate(dateString);
  };

  // Find previous and next posts
  const currentIndex = allPosts.findIndex(p => p.slug === slug);
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <div className="min-h-screen pt-16 bg-[rgb(var(--color-background))]">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        {/* Back to Blog */}
        <div className="mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-primary))] transition-colors duration-200"
          >
            <Icon icon="lucide:arrow-left" width={16} height={16} className="mr-2" />
            Back to Blog
          </Link>
        </div>

        {/* Post Header */}
        <header className="mb-12">
          {/* Featured Image */}
          {post.featured_image && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <OptimizedImage
                src={post.featured_image}
                alt={`Featured image for ${post.title}`}
                width={800}
                height={400}
                className="w-full h-64 md:h-96 object-cover"
                priority={true}
              />
            </div>
          )}

          {/* Featured Badge */}
          {post.featured && (
            <div className="mb-4">
              <span className="px-3 py-1 bg-[rgb(var(--color-primary))] text-white text-sm font-medium rounded-full">
                Featured Post
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
          <h1 className="text-4xl md:text-5xl font-extrabold text-[rgb(var(--color-foreground))] mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-[rgb(var(--color-muted-foreground))] mb-6">
            <div className="flex items-center">
              <Icon icon="lucide:user" width={16} height={16} className="mr-2" />
              <span>Admin</span>
            </div>
            <div className="flex items-center">
              <Icon icon="lucide:calendar" width={16} height={16} className="mr-2" />
              <span>{formatDate(post.published_at || post.created_at)}</span>
            </div>
            <div className="flex items-center">
              <Icon icon="lucide:clock" width={16} height={16} className="mr-2" />
              <span>{Math.ceil(post.content.split(' ').length / 200)} min read</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag, index) => (
              <Link
                key={index}
                to={`/blog?tag=${encodeURIComponent(tag)}`}
                className="px-3 py-1 bg-[rgb(var(--color-muted))] text-[rgb(var(--color-foreground))] text-sm rounded-full hover:bg-[rgb(var(--color-primary))] hover:text-white transition-colors duration-200"
              >
                #{tag}
              </Link>
            ))}
          </div>

          {/* Excerpt */}
          <p className="text-xl text-[rgb(var(--color-muted-foreground))] leading-relaxed">
            {post.excerpt}
          </p>
        </header>

        {/* Post Content */}
        <div className="prose prose-lg max-w-none">
          <div 
            className="text-[rgb(var(--color-foreground))] leading-relaxed"
            style={{ 
              lineHeight: '1.8',
              fontSize: '1.125rem'
            }}
          >
            {/* Render markdown-like content */}
            {post.content.split('\n\n').map((paragraph, index) => {
              // Handle headings
              if (paragraph.startsWith('# ')) {
                return (
                  <h1 key={index} className="text-3xl font-bold mt-12 mb-6 text-[rgb(var(--color-foreground))]">
                    {paragraph.substring(2)}
                  </h1>
                );
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-2xl font-bold mt-10 mb-4 text-[rgb(var(--color-foreground))]">
                    {paragraph.substring(3)}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-xl font-bold mt-8 mb-3 text-[rgb(var(--color-foreground))]">
                    {paragraph.substring(4)}
                  </h3>
                );
              }

              // Handle code blocks
              if (paragraph.startsWith('```')) {
                const lines = paragraph.split('\n');
                const language = lines[0].substring(3);
                const code = lines.slice(1, -1).join('\n');
                return (
                  <div key={index} className="my-6">
                    <pre className="bg-[rgb(var(--color-muted))] p-4 rounded-lg overflow-x-auto border border-[rgb(var(--color-border))]">
                      <code className="text-sm text-[rgb(var(--color-foreground))]">
                        {code}
                      </code>
                    </pre>
                  </div>
                );
              }

              // Handle blockquotes
              if (paragraph.startsWith('> ')) {
                return (
                  <blockquote key={index} className="border-l-4 border-[rgb(var(--color-primary))] pl-6 my-6 italic text-[rgb(var(--color-muted-foreground))]">
                    {paragraph.substring(2)}
                  </blockquote>
                );
              }

              // Handle lists
              if (paragraph.includes('- **') || paragraph.includes('1. **')) {
                const items = paragraph.split('\n').filter(line => line.trim());
                return (
                  <ul key={index} className="my-6 space-y-2">
                    {items.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="w-2 h-2 bg-[rgb(var(--color-accent))] rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                        <span className="text-[rgb(var(--color-muted-foreground))]">
                          {item.replace(/^[\d\-\*]\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
                        </span>
                      </li>
                    ))}
                  </ul>
                );
              }

              // Regular paragraphs
              if (paragraph.trim() && !paragraph.startsWith('---')) {
                return (
                  <p key={index} className="mb-6 text-[rgb(var(--color-muted-foreground))] leading-relaxed">
                    {paragraph.replace(/\*\*(.*?)\*\*/g, '<strong className="font-semibold text-[rgb(var(--color-foreground))]">$1</strong>')}
                  </p>
                );
              }

              return null;
            })}
          </div>
        </div>

        {/* Comments Section */}
        <CommentSection postId={post.id} />

        {/* Post Navigation */}
        <div className="mt-16 pt-8 border-t border-[rgb(var(--color-border))]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Previous Post */}
            {previousPost && (
              <Link
                to={`/blog/${previousPost.slug}`}
                className="group p-6 bg-[rgb(var(--color-muted))] rounded-lg border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))] transition-all duration-300"
              >
                <div className="flex items-center text-[rgb(var(--color-muted-foreground))] mb-2">
                  <Icon icon="lucide:arrow-left" width={16} height={16} className="mr-2" />
                  <span className="text-sm">Previous Post</span>
                </div>
                <h3 className="font-semibold text-[rgb(var(--color-foreground))] group-hover:text-[rgb(var(--color-primary))] transition-colors duration-200">
                  {previousPost.title}
                </h3>
              </Link>
            )}

            {/* Next Post */}
            {nextPost && (
              <Link
                to={`/blog/${nextPost.slug}`}
                className="group p-6 bg-[rgb(var(--color-muted))] rounded-lg border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))] transition-all duration-300 md:text-right"
              >
                <div className="flex items-center justify-end text-[rgb(var(--color-muted-foreground))] mb-2">
                  <span className="text-sm">Next Post</span>
                  <Icon icon="lucide:arrow-right" width={16} height={16} className="ml-2" />
                </div>
                <h3 className="font-semibold text-[rgb(var(--color-foreground))] group-hover:text-[rgb(var(--color-primary))] transition-colors duration-200">
                  {nextPost.title}
                </h3>
              </Link>
            )}
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-[rgb(var(--color-foreground))] mb-8">
              Related Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="group bg-[rgb(var(--color-muted))] p-6 rounded-lg border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))] transition-all duration-300"
                >
                  <div className="mb-3">
                    <span className="px-2 py-1 bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] text-xs rounded">
                      {relatedPost.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-[rgb(var(--color-foreground))] mb-2 group-hover:text-[rgb(var(--color-primary))] transition-colors duration-200 line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-sm text-[rgb(var(--color-muted-foreground))] line-clamp-2">
                    {relatedPost.excerpt}
                  </p>
                  <div className="flex items-center mt-3 text-xs text-[rgb(var(--color-muted-foreground))]">
                    <Icon icon="lucide:clock" width={12} height={12} className="mr-1" />
                    {Math.ceil(relatedPost.content.split(' ').length / 200)} min read
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 p-8 bg-[rgb(var(--color-muted))] rounded-lg border border-[rgb(var(--color-border))] text-center">
          <h3 className="text-xl font-bold text-[rgb(var(--color-foreground))] mb-4">
            Enjoyed this article?
          </h3>
          <p className="text-[rgb(var(--color-muted-foreground))] mb-6">
            If you found this helpful and want to discuss your project or need technical consultation, 
            I'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/#contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary))]/90 transition-colors duration-200"
            >
              Get In Touch
            </Link>
            <Link
              to="/blog"
              className="inline-flex items-center justify-center px-6 py-3 border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] rounded-md hover:bg-[rgb(var(--color-background))] transition-colors duration-200"
            >
              Read More Posts
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}; 