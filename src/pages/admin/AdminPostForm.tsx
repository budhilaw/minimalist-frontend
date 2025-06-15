import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { RichTextEditor } from '../../components/admin/RichTextEditor';
import { Sanitizer, AuditLogger } from '../../utils/security';
import { formatBlogDate, formatTableDate } from '../../utils/dateFormatter';
import { postsService, CreatePostRequest, UpdatePostRequest } from '../../services/postsService';

interface PostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  publishDate: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export const AdminPostForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Technology',
    tags: [],
    featured: false,
    published: false,
    publishDate: new Date().toISOString().split('T')[0],
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: []
    }
  });

  const [currentTag, setCurrentTag] = useState('');
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>('content');
  const [postInfo, setPostInfo] = useState<{
    createdAt?: string;
    updatedAt?: string;
    author?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Available categories
  const categories = [
    'Technology',
    'Web Development',
    'Software Engineering',
    'Career Development',
    'Tutorial',
    'Industry Insights'
  ];

  // Load existing post data for editing
  useEffect(() => {
    if (isEditing && id) {
      const loadPost = async () => {
        try {
          setLoading(true);
          const response = await postsService.getPostById(id);
          if (response.data) {
            const post = response.data;
            setFormData({
              title: post.title,
              slug: post.slug,
              excerpt: post.excerpt || '',
              content: post.content,
              category: post.category,
              tags: post.tags,
              featured: post.featured,
              published: post.published,
              publishDate: post.published_at ? post.published_at.split('T')[0] : post.created_at.split('T')[0],
              seo: {
                metaTitle: post.seo_title || post.title,
                metaDescription: post.seo_description || post.excerpt || '',
                keywords: post.seo_keywords ? post.seo_keywords.split(',').map(k => k.trim()) : post.tags
              }
            });
            setPostInfo({
              createdAt: post.created_at,
              updatedAt: post.updated_at,
              author: 'Admin' // Default author since backend doesn't have author info
            });
          }
        } catch (error) {
          console.error('Failed to load post:', error);
          alert('Failed to load post data');
        } finally {
          setLoading(false);
        }
      };
      
      loadPost();
    }
  }, [isEditing, id]);

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Handle title change and auto-generate slug
  const handleTitleChange = (title: string) => {
    const sanitizedTitle = Sanitizer.sanitizeText(title);
    setFormData(prev => ({
      ...prev,
      title: sanitizedTitle,
      slug: !isEditing ? generateSlug(sanitizedTitle) : prev.slug,
      seo: {
        ...prev.seo,
        metaTitle: sanitizedTitle
      }
    }));
  };

  // Handle excerpt change and auto-update SEO description
  const handleExcerptChange = (excerpt: string) => {
    // Don't sanitize during typing, only on form submission
    setFormData(prev => ({
      ...prev,
      excerpt: excerpt,
      seo: {
        ...prev.seo,
        metaDescription: excerpt
      }
    }));
  };

  // Add tag
  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      const sanitizedTag = Sanitizer.sanitizeText(currentTag.trim());
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, sanitizedTag]
      }));
      setCurrentTag('');
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Add SEO keyword
  const addKeyword = () => {
    if (currentKeyword.trim() && !formData.seo.keywords.includes(currentKeyword.trim())) {
      const sanitizedKeyword = Sanitizer.sanitizeText(currentKeyword.trim());
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          keywords: [...prev.seo.keywords, sanitizedKeyword]
        }
      }));
      setCurrentKeyword('');
    }
  };

  // Remove SEO keyword
  const removeKeyword = (keywordToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: prev.seo.keywords.filter(keyword => keyword !== keywordToRemove)
      }
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Validate required fields
      if (!formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim()) {
        setMessage({
          type: 'error',
          text: 'Please fill in all required fields (Title, Excerpt, Content)'
        });
        return;
      }

      // Prepare data for API
      const postData: CreatePostRequest | UpdatePostRequest = {
        title: Sanitizer.sanitizeText(formData.title),
        slug: formData.slug || generateSlug(formData.title),
        content: Sanitizer.sanitizeHTML(formData.content),
        excerpt: Sanitizer.sanitizeText(formData.excerpt),
        category: formData.category,
        tags: formData.tags,
        featured: formData.featured,
        published: formData.published,
        seo_title: formData.seo.metaTitle,
        seo_description: formData.seo.metaDescription,
        seo_keywords: formData.seo.keywords.join(', ')
      };

      let response;
      if (isEditing && id) {
        response = await postsService.updatePost(id, postData);
      } else {
        response = await postsService.createPost(postData);
      }

      if (response.error) {
        setMessage({
          type: 'error',
          text: `Error ${isEditing ? 'updating' : 'creating'} post: ${response.error}`
        });
        return;
      }

      // Log action
      AuditLogger.log(isEditing ? 'POST_UPDATED' : 'POST_CREATED', {
        postId: id || 'new',
        title: postData.title,
        category: postData.category,
        published: postData.published
      });

      // Show success message and stay on the page
      setMessage({
        type: 'success',
        text: `Post ${isEditing ? 'updated' : 'created'} successfully!`
      });

      // If creating a new post, redirect to edit mode with the new post ID
      if (!isEditing && response.data?.post) {
        const newPostId = response.data.post.id;
        navigate(`/admin/posts/${newPostId}/edit`, { replace: true });
      }

      // Update post info if we're editing
      if (isEditing && response.data?.post) {
        const updatedPost = response.data.post;
        setPostInfo({
          createdAt: updatedPost.created_at,
          updatedAt: updatedPost.updated_at,
          author: 'Admin'
        });
      }

      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage(null);
      }, 5000);

    } catch (error) {
      setMessage({
        type: 'error',
        text: `Error ${isEditing ? 'updating' : 'creating'} post. Please try again.`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle save as draft
  const handleSaveAsDraft = () => {
    setFormData(prev => ({ ...prev, published: false }));
    // Trigger form submission
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        form.requestSubmit();
      }
    }, 0);
  };

  return (
    <div className="max-w-7xl mx-auto admin-container">
      <link rel="stylesheet" href="/src/styles/admin-mobile.css" />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/posts"
            className="flex items-center text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-primary))] transition-colors"
          >
            <Icon icon="lucide:arrow-left" width={20} height={20} className="mr-2" />
            Back to Posts
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[rgb(var(--color-foreground))]">
              {isEditing ? 'Edit Post' : 'Create New Post'}
            </h1>
            <p className="text-[rgb(var(--color-muted-foreground))] mt-1">
              {isEditing ? 'Update your blog post content and settings' : 'Write and publish a new blog post'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center px-4 py-2 border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] rounded-md hover:bg-[rgb(var(--color-muted))] transition-colors"
          >
            <Icon icon="lucide:eye" width={16} height={16} className="mr-2" />
            {showPreview ? 'Hide Preview' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[rgb(var(--color-background))] rounded-lg shadow-xl w-full max-w-4xl h-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-[rgb(var(--color-border))]">
              <h2 className="text-xl font-semibold text-[rgb(var(--color-foreground))]">
                Preview: {formData.title || 'Untitled Post'}
              </h2>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-foreground))] transition-colors"
              >
                <Icon icon="lucide:x" width={20} height={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <article className="prose prose-lg max-w-none">
                <header className="mb-8">
                  <h1 className="text-3xl font-bold text-[rgb(var(--color-foreground))] mb-4">
                    {formData.title || 'Untitled Post'}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[rgb(var(--color-muted-foreground))] mb-4">
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:user" width={16} height={16} />
                      <span>Ericsson Budhilaw</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:calendar" width={16} height={16} />
                      <span>{formatBlogDate(formData.publishDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:tag" width={16} height={16} />
                      <span>{formData.category}</span>
                    </div>
                  </div>

                  {formData.excerpt && (
                    <p className="text-lg text-[rgb(var(--color-muted-foreground))] mb-6">
                      {formData.excerpt}
                    </p>
                  )}

                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[rgb(var(--color-muted))] text-[rgb(var(--color-foreground))] rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </header>

                <div 
                  className="prose-content text-[rgb(var(--color-foreground))]"
                  style={{
                    lineHeight: '1.7',
                  }}
                >
                  {/* Render markdown content same as BlogPost.tsx */}
                  {formData.content ? (
                    formData.content.split('\n\n').map((paragraph, index) => {
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
                      if (paragraph.includes('- **') || paragraph.includes('1. **') || paragraph.includes('- ') || paragraph.includes('1. ')) {
                        const items = paragraph.split('\n').filter(line => line.trim());
                        const isOrdered = items[0]?.match(/^\d+\./);
                        return (
                          <ul key={index} className={`my-6 space-y-2 ${isOrdered ? 'list-decimal list-inside' : ''}`}>
                            {items.map((item, idx) => (
                              <li key={idx} className="flex items-start">
                                {!isOrdered && <span className="w-2 h-2 bg-[rgb(var(--color-accent))] rounded-full mt-2.5 mr-3 flex-shrink-0"></span>}
                                <span 
                                  className="text-[rgb(var(--color-muted-foreground))]"
                                  dangerouslySetInnerHTML={{
                                    __html: item.replace(/^[\d\-\*]\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong className="font-semibold text-[rgb(var(--color-foreground))]">$1</strong>')
                                  }}
                                />
                              </li>
                            ))}
                          </ul>
                        );
                      }

                      // Regular paragraphs
                      if (paragraph.trim() && !paragraph.startsWith('---')) {
                        return (
                          <p 
                            key={index} 
                            className="mb-6 text-[rgb(var(--color-muted-foreground))] leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong className="font-semibold text-[rgb(var(--color-foreground))]">$1</strong>')
                                              .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                              .replace(/`(.*?)`/g, '<code className="bg-[rgb(var(--color-muted))] px-1 py-0.5 rounded text-sm">$1</code>')
                                              .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" className="text-[rgb(var(--color-primary))] underline">$1</a>')
                            }}
                          />
                        );
                      }

                      return null;
                    })
                  ) : (
                    <p className="text-[rgb(var(--color-muted-foreground))] italic">No content yet...</p>
                  )}
                </div>
              </article>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Message */}
      {message && (
        <div className={`p-4 rounded-lg border mb-6 ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200'
            : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200'
        }`}>
          <div className="flex items-center">
            <Icon 
              icon={message.type === 'success' ? 'lucide:check-circle' : 'lucide:alert-circle'} 
              className="mr-2" 
              width={20} 
              height={20} 
            />
            <span>{message.text}</span>
            <button
              type="button"
              onClick={() => setMessage(null)}
              className="ml-auto hover:opacity-70"
            >
              <Icon icon="lucide:x" width={16} height={16} />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 admin-post-form form-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Title */}
            <div className="bg-[rgb(var(--color-card))] p-6 rounded-lg border border-[rgb(var(--color-border))]">
              <label htmlFor="title" className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                Post Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-3 text-lg border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
                placeholder="Enter your post title..."
                required
              />
              
              {/* Slug */}
              <div className="mt-4">
                <label htmlFor="slug" className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                  URL Slug
                </label>
                <div className="flex items-center">
                  <span className="text-sm text-[rgb(var(--color-muted-foreground))] mr-2">
                    /blog/
                  </span>
                  <input
                    type="text"
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="flex-1 px-3 py-2 text-sm border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
                    placeholder="post-url-slug"
                  />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-[rgb(var(--color-card))] rounded-lg border border-[rgb(var(--color-border))] overflow-hidden">
              <div className="border-b border-[rgb(var(--color-border))]">
                <nav className="flex tab-navigation">
                  {[
                    { id: 'content', label: 'Content', icon: <Icon icon="lucide:file-text" width={16} height={16} /> },
                    { id: 'seo', label: 'SEO', icon: <Icon icon="lucide:globe" width={16} height={16} /> },
                    { id: 'settings', label: 'Settings', icon: <Icon icon="lucide:star" width={16} height={16} /> }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center px-6 py-3 text-sm font-medium border-r border-[rgb(var(--color-border))] transition-colors ${
                        activeTab === tab.id
                          ? 'bg-[rgb(var(--color-primary))] text-white'
                          : 'text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-muted))]'
                      }`}
                    >
                      {tab.icon}
                      <span className="ml-2">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Content Tab */}
                {activeTab === 'content' && (
                  <div className="space-y-6">
                    {/* Excerpt */}
                    <div>
                      <label htmlFor="excerpt" className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                        Excerpt *
                      </label>
                      <textarea
                        id="excerpt"
                        rows={3}
                        value={formData.excerpt}
                        onChange={(e) => handleExcerptChange(e.target.value)}
                        className="w-full px-4 py-3 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent resize-none"
                        placeholder="Write a brief excerpt for your post..."
                        required
                      />
                      <p className="text-xs text-[rgb(var(--color-muted-foreground))] mt-1">
                        This will be displayed in post previews and search results.
                      </p>
                    </div>

                    {/* Content Editor */}
                    <div>
                      <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                        Content *
                      </label>
                      <RichTextEditor
                        value={formData.content}
                        onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                        placeholder="Start writing your blog post..."
                        minHeight="500px"
                      />
                    </div>
                  </div>
                )}

                {/* SEO Tab */}
                {activeTab === 'seo' && (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="metaTitle" className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                        Meta Title
                      </label>
                      <input
                        type="text"
                        id="metaTitle"
                        value={formData.seo.metaTitle}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          seo: { ...prev.seo, metaTitle: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
                        placeholder="SEO title for search engines..."
                        maxLength={60}
                      />
                      <p className="text-xs text-[rgb(var(--color-muted-foreground))] mt-1">
                        {formData.seo.metaTitle.length}/60 characters
                      </p>
                    </div>

                    <div>
                      <label htmlFor="metaDescription" className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                        Meta Description
                      </label>
                      <textarea
                        id="metaDescription"
                        rows={3}
                        value={formData.seo.metaDescription}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          seo: { ...prev.seo, metaDescription: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent resize-none"
                        placeholder="SEO description for search engines..."
                        maxLength={160}
                      />
                      <p className="text-xs text-[rgb(var(--color-muted-foreground))] mt-1">
                        {formData.seo.metaDescription.length}/160 characters
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                        SEO Keywords
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.seo.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 bg-[rgb(var(--color-muted))] text-[rgb(var(--color-foreground))] rounded-full text-sm"
                          >
                            {keyword}
                            <button
                              type="button"
                              onClick={() => removeKeyword(keyword)}
                              className="ml-2 text-[rgb(var(--color-muted-foreground))] hover:text-red-600"
                            >
                              <Icon icon="lucide:x" width={14} height={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2 tag-input-group">
                        <input
                          type="text"
                          value={currentKeyword}
                          onChange={(e) => setCurrentKeyword(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addKeyword();
                            }
                          }}
                          className="flex-1 px-3 py-2 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent form-input"
                          placeholder="Add SEO keyword..."
                        />
                        <button
                          type="button"
                          onClick={addKeyword}
                          className="px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary))]/90 transition-colors"
                        >
                          <Icon icon="lucide:plus" width={16} height={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                        Category
                      </label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-3 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="publishDate" className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                        Publish Date
                      </label>
                      <input
                        type="date"
                        id="publishDate"
                        value={formData.publishDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, publishDate: e.target.value }))}
                        className="w-full px-4 py-3 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[rgb(var(--color-muted))] rounded-md">
                      <div>
                        <h4 className="font-medium text-[rgb(var(--color-foreground))]">Featured Post</h4>
                        <p className="text-sm text-[rgb(var(--color-muted-foreground))]">
                          Display this post prominently on the homepage
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[rgb(var(--color-border))] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[rgb(var(--color-primary))]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[rgb(var(--color-primary))]"></div>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Options */}
            <div className="bg-[rgb(var(--color-card))] p-6 rounded-lg border border-[rgb(var(--color-border))]">
              <h3 className="text-lg font-semibold text-[rgb(var(--color-foreground))] mb-4">
                Publish Options
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-[rgb(var(--color-muted))] rounded-md">
                  <div>
                    <h4 className="font-medium text-[rgb(var(--color-foreground))]">Status</h4>
                    <p className="text-sm text-[rgb(var(--color-muted-foreground))]">
                      {formData.published ? 'Published' : 'Draft'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[rgb(var(--color-border))] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[rgb(var(--color-primary))]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[rgb(var(--color-primary))]"></div>
                  </label>
                </div>

                <div className="space-y-3 publish-options">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center px-4 py-3 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary))]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed form-input"
                  >
                    <Icon icon="lucide:save" width={16} height={16} className="mr-2" />
                    {isSubmitting 
                      ? 'Saving...' 
                      : isEditing
                        ? (formData.published ? 'Update Post' : 'Update Draft')
                        : (formData.published ? 'Publish Post' : 'Save Draft')
                    }
                  </button>

                  {formData.published && (
                    <button
                      type="button"
                      onClick={handleSaveAsDraft}
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center px-4 py-3 border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] rounded-md hover:bg-[rgb(var(--color-muted))] transition-colors disabled:opacity-50 disabled:cursor-not-allowed form-input"
                    >
                      Save as Draft
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-[rgb(var(--color-card))] p-6 rounded-lg border border-[rgb(var(--color-border))]">
              <h3 className="text-lg font-semibold text-[rgb(var(--color-foreground))] mb-4">
                Tags
              </h3>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-[rgb(var(--color-muted))] text-[rgb(var(--color-foreground))] rounded-full text-sm"
                    >
                      <Icon icon="lucide:tag" width={12} height={12} className="mr-1" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-[rgb(var(--color-muted-foreground))] hover:text-red-600"
                      >
                        <Icon icon="lucide:x" width={14} height={14} />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 tag-input-group">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent form-input"
                    placeholder="Add tag..."
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary))]/90 transition-colors"
                  >
                    <Icon icon="lucide:plus" width={16} height={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Post Info */}
            <div className="bg-[rgb(var(--color-card))] p-6 rounded-lg border border-[rgb(var(--color-border))]">
              <h3 className="text-lg font-semibold text-[rgb(var(--color-foreground))] mb-4">
                Post Information
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[rgb(var(--color-muted-foreground))]">Author:</span>
                  <span className="text-[rgb(var(--color-foreground))]">
                    {isEditing ? (loading ? 'Loading...' : postInfo.author || 'Admin') : 'Admin'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[rgb(var(--color-muted-foreground))]">Created:</span>
                  <span className="text-[rgb(var(--color-foreground))]">
                    {isEditing 
                      ? (loading ? 'Loading...' : postInfo.createdAt ? formatBlogDate(postInfo.createdAt) : 'Unknown')
                      : 'New post'
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[rgb(var(--color-muted-foreground))]">Last Modified:</span>
                  <span className="text-[rgb(var(--color-foreground))]">
                    {isEditing 
                      ? (loading ? 'Loading...' : postInfo.updatedAt ? formatBlogDate(postInfo.updatedAt) : 'Unknown')
                      : 'Not saved yet'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}; 