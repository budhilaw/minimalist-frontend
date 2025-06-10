export interface Service {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  features: string[];
  icon: string; // We'll store icon names as strings for admin editing
  category: 'development' | 'consulting' | 'design' | 'devops';
  pricing?: {
    type: 'fixed' | 'hourly' | 'project' | 'custom';
    amount?: number;
    currency: string;
    unit?: string; // e.g., 'per hour', 'per project'
  };
  
  active: boolean;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Icon mapping for display purposes
export const iconMap: Record<string, string> = {
  'code': 'lucide:code',
  'users': 'lucide:users',
  'settings': 'lucide:settings',
  'search': 'lucide:search',
  'rocket': 'lucide:rocket',
  'shield': 'lucide:shield'
};

export const services: Service[] = [
  {
    id: 'full-stack-development',
    title: 'Full-Stack Development',
    description: 'End-to-end web applications built with modern frontend frameworks like ReactJS, VueJS, NextJS and robust backend technologies including Go, Node.js, Python, and PHP.',
    longDescription: `Comprehensive full-stack development services that cover every aspect of web application development, from frontend user interfaces to backend systems and database architecture.

## Frontend Excellence
- **ReactJS Applications**: Modern, scalable React applications with hooks, context, and performance optimization
- **VueJS Development**: Component-based Vue.js applications with Vuex state management
- **NextJS Solutions**: Server-side rendered applications with optimal SEO and performance
- **Progressive Web Apps**: Modern PWAs with offline capabilities and native-like experience

## Backend Mastery  
- **Go Development**: High-performance backend services with excellent concurrency
- **Node.js APIs**: Fast, scalable server-side applications with Express and Fastify
- **Python Solutions**: Robust backend systems with Django, FastAPI, and Flask
- **PHP Development**: Enterprise-grade applications with Laravel and custom frameworks

## Database & Infrastructure
- **Database Design**: Optimized database schemas for PostgreSQL, MySQL, MongoDB
- **API Architecture**: RESTful APIs and GraphQL endpoints with proper documentation
- **Real-time Features**: WebSocket implementation for live updates and notifications
- **Performance Optimization**: Caching strategies, query optimization, and load balancing`,
    features: [
      'Frontend development with ReactJS, VueJS, NextJS',
      'Backend APIs with Go, Node.js, Python, PHP',
      'Database design and optimization',
      'Real-time applications and WebSocket implementation',
      'Progressive Web Apps (PWA) development'
    ],
    icon: 'code',
    category: 'development',
    pricing: {
      type: 'hourly',
      amount: 75,
      currency: 'USD',
      unit: 'per hour'
    },

    active: true,
    featured: true,
    order: 1,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-12-15T10:30:00Z'
  },
  {
    id: 'frontend-development',
    title: 'Frontend Development',
    description: 'Modern, responsive user interfaces built with cutting-edge frontend technologies. Specializing in ReactJS, VueJS, and NextJS for optimal user experience.',
    longDescription: `Specialized frontend development services focused on creating exceptional user experiences with modern JavaScript frameworks and best practices.

## Modern Framework Expertise
- **React Development**: Component-based architecture with hooks, context, and advanced patterns
- **Vue.js Applications**: Reactive user interfaces with composition API and Pinia state management
- **Next.js Solutions**: Full-stack React framework with SSR, SSG, and API routes
- **TypeScript Integration**: Type-safe development for better code quality and maintainability

## UI/UX Excellence
- **Responsive Design**: Mobile-first approach ensuring perfect experience across all devices
- **Performance Optimization**: Code splitting, lazy loading, and bundle optimization
- **Accessibility**: WCAG-compliant interfaces for inclusive user experiences
- **Design Systems**: Consistent, reusable component libraries and style guides

## Advanced Features
- **State Management**: Redux, Zustand, or Context API for complex application state
- **Testing**: Unit tests, integration tests, and E2E testing with Jest and Cypress
- **Build Tools**: Webpack, Vite, and modern bundling for optimal development experience
- **Progressive Enhancement**: Modern features with graceful fallbacks`,
    features: [
      'ReactJS application development',
      'VueJS single-page applications',
      'NextJS server-side rendering',
      'Responsive and mobile-first design',
      'State management and performance optimization'
    ],
    icon: 'rocket',
    category: 'development',
    pricing: {
      type: 'hourly',
      amount: 65,
      currency: 'USD',
      unit: 'per hour'
    },
    active: true,
    featured: true,
    order: 2,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-12-10T14:20:00Z'
  },
  {
    id: 'backend-development',
    title: 'Backend Development',
    description: 'Robust backend services and APIs built with modern technologies like Go, Node.js, and Python. Scalable solutions designed for performance and reliability.',
    longDescription: `Professional backend development services that power your applications with robust, scalable, and secure server-side solutions.

## Technology Stack
- **Go Development**: Ultra-fast, concurrent backend services for high-performance applications
- **Node.js Solutions**: JavaScript-based server applications with Express, Fastify, and NestJS
- **Python Services**: Enterprise-grade backends with Django, FastAPI, and Flask frameworks
- **API Development**: RESTful APIs, GraphQL endpoints, and microservices architecture

## Database Excellence
- **Relational Databases**: PostgreSQL and MySQL optimization, indexing, and performance tuning
- **NoSQL Solutions**: MongoDB, Redis, and document-based database design
- **Data Modeling**: Efficient schema design and relationship optimization
- **Migration Strategies**: Safe database migrations and version control

## Enterprise Features
- **Authentication & Authorization**: JWT, OAuth 2.0, and role-based access control
- **Caching Strategies**: Redis, Memcached, and application-level caching
- **Message Queues**: RabbitMQ, Apache Kafka for asynchronous processing
- **Monitoring & Logging**: Application monitoring, error tracking, and performance analytics`,
    features: [
      'RESTful API development',
      'Microservices architecture',
      'Database design and optimization',
      'Third-party integrations',
      'Real-time data processing'
    ],
    icon: 'settings',
    category: 'development',
    pricing: {
      type: 'hourly',
      amount: 70,
      currency: 'USD',
      unit: 'per hour'
    },
    active: true,
    featured: false,
    order: 3,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-11-25T16:45:00Z'
  },
  {
    id: 'technical-consulting',
    title: 'Technical Consulting',
    description: 'Expert guidance on full-stack development projects, technology choices, and system improvements. Helping teams build better software solutions from frontend to backend.',
    longDescription: `Strategic technical consulting services to help organizations make informed technology decisions and optimize their development processes.

## Technology Strategy
- **Architecture Review**: Evaluation of current system architecture and improvement recommendations
- **Technology Selection**: Guidance on choosing the right frontend and backend technologies
- **Performance Audits**: Comprehensive analysis of application performance bottlenecks
- **Security Assessment**: Code review and security vulnerability analysis

## Team Development
- **Best Practices Training**: Teaching modern development practices and patterns
- **Code Review Services**: Ongoing code quality assessment and improvement suggestions
- **Mentoring Programs**: Individual and team mentoring for skill development
- **Process Optimization**: Improving development workflows and team productivity

## Project Consulting
- **Technical Due Diligence**: Assessment of technical assets for business decisions
- **Scalability Planning**: Preparing applications for growth and increased load
- **Integration Strategy**: Planning and executing third-party service integrations
- **Migration Support**: Assistance with technology migrations and upgrades`,
    features: [
      'Frontend framework selection (React/Vue/Next)',
      'Backend technology stack consultation',
      'Performance troubleshooting',
      'Development best practices',
      'Team mentoring and training'
    ],
    icon: 'users',
    category: 'consulting',
    pricing: {
      type: 'hourly',
      amount: 85,
      currency: 'USD',
      unit: 'per hour'
    },
    active: true,
    featured: false,
    order: 4,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-12-05T09:15:00Z'
  },
  {
    id: 'system-architecture',
    title: 'System Architecture',
    description: 'Design and implement efficient full-stack system architectures that scale with your business needs. Focus on performance, maintainability, and cost-effectiveness.',
    longDescription: `Comprehensive system architecture services that lay the foundation for scalable, maintainable, and efficient software systems.

## Architecture Design
- **Full-Stack Architecture**: End-to-end system design from frontend to backend and database
- **Microservices Design**: Breaking down monoliths into scalable, manageable services
- **API Architecture**: Designing robust, versioned APIs that support long-term growth
- **Data Architecture**: Optimizing data flow, storage, and retrieval patterns

## Scalability Planning
- **Load Balancing**: Distributing traffic efficiently across multiple servers
- **Caching Strategies**: Implementing multi-level caching for optimal performance
- **Database Scaling**: Horizontal and vertical scaling strategies for data persistence
- **CDN Integration**: Content delivery optimization for global applications

## Technology Integration
- **Cloud Architecture**: AWS, GCP, and Azure cloud-native architecture design
- **Containerization**: Docker and Kubernetes orchestration for deployment
- **CI/CD Pipelines**: Automated testing, building, and deployment workflows
- **Monitoring Solutions**: Application performance monitoring and alerting systems`,
    features: [
      'Frontend architecture design',
      'Backend system architecture',
      'Database architecture planning',
      'Cloud infrastructure design',
      'Technology stack optimization'
    ],
    icon: 'search',
    category: 'consulting',
    pricing: {
      type: 'project',
      amount: 2500,
      currency: 'USD',
      unit: 'per project'
    },
    active: true,
    featured: true,
    order: 5,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-11-30T11:30:00Z'
  },
  {
    id: 'devops-deployment',
    title: 'DevOps & Deployment',
    description: 'Streamline development workflows with modern DevOps practices. Containerization, CI/CD pipelines, and automated deployment solutions for full-stack applications.',
    longDescription: `Modern DevOps services that automate your development and deployment processes, ensuring reliable, fast, and secure application delivery.

## Containerization & Orchestration
- **Docker Solutions**: Containerizing applications for consistent development and production environments
- **Kubernetes Management**: Container orchestration for scalable, self-healing deployments
- **Container Security**: Implementing security best practices for containerized applications
- **Registry Management**: Private container registries and image optimization

## CI/CD Implementation
- **Pipeline Design**: Automated testing, building, and deployment workflows
- **Multi-Environment Setup**: Development, staging, and production environment management
- **Automated Testing**: Integration of unit, integration, and E2E tests in pipelines
- **Deployment Strategies**: Blue-green, canary, and rolling deployment implementations

## Infrastructure Management
- **Infrastructure as Code**: Terraform, CloudFormation for reproducible infrastructure
- **Cloud Deployment**: AWS, GCP, Azure deployment optimization and management
- **Monitoring & Alerting**: Application and infrastructure monitoring with Grafana, Prometheus
- **Backup & Recovery**: Automated backup strategies and disaster recovery planning`,
    features: [
      'Docker containerization',
      'CI/CD pipeline setup',
      'Cloud deployment automation (AWS/GCP)',
      'Monitoring and logging implementation',
      'Infrastructure optimization'
    ],
    icon: 'shield',
    category: 'devops',
    pricing: {
      type: 'project',
      amount: 3000,
      currency: 'USD',
      unit: 'per project'
    },
    active: true,
    featured: false,
    order: 6,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-12-01T13:45:00Z'
  }
]; 