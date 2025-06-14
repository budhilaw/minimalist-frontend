// Admin authentication types
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: 'admin' | 'super_admin';
  lastLogin: Date;
  isActive: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Admin content types
export interface AdminPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    email: string;
    role: string;
  };
  publishDate: string;
  lastModified: string;
  readTime: string;
  featured: boolean;
  published: boolean;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export interface AdminProject {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: 'Frontend' | 'Backend' | 'Full-Stack' | 'Mobile';
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  featured: boolean;
  status: 'completed' | 'in-progress' | 'planned';
  startDate: string;
  endDate?: string;
  client?: string;
}

export interface AdminService {
  id: string;
  title: string;
  description: string;
  features: string[];
  price?: {
    type: 'fixed' | 'hourly' | 'project';
    amount: number;
    currency: string;
  };
  deliveryTime: string;
  category: string;
  active: boolean;
}



// Dashboard analytics types
export interface DashboardStats {
  posts: {
    total: number;
    published: number;
    drafts: number;
    recentViews: number;
  };
  projects: {
    total: number;
    completed: number;
    inProgress: number;
  };
  comments: {
    total: number;
    pending: number;
    approved: number;
  };
  analytics: {
    pageViews: number;
    uniqueVisitors: number;
    bounceRate: number;
  };
} 