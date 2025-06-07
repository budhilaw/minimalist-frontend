export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: 'web' | 'mobile' | 'backend' | 'ai';
  technologies: string[];
  image: string; // emoji or URL
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  status: 'completed' | 'in-progress' | 'planned';
  startDate: string;
  endDate?: string;
  client?: string;
  highlights: string[];
  createdAt: string;
  updatedAt: string;
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with React, Node.js, and PostgreSQL. Features include real-time inventory, payment integration, and admin dashboard.',
    longDescription: `A comprehensive e-commerce platform built from the ground up to handle high-traffic scenarios and complex business requirements.

## Key Features
- **Real-time Inventory Management**: Live stock updates across all channels
- **Payment Processing**: Integrated with Stripe and PayPal for secure transactions
- **Admin Dashboard**: Comprehensive analytics and management tools
- **Multi-vendor Support**: Platform for multiple sellers with commission tracking
- **Mobile Responsive**: Optimized shopping experience across all devices

## Technical Highlights
- Handles 10,000+ concurrent users with horizontal scaling
- Microservices architecture for modularity and maintainability
- Real-time notifications using WebSocket connections
- Advanced caching strategies for optimal performance
- Comprehensive testing suite with 95% code coverage

## Business Impact
- Increased conversion rates by 35% compared to previous platform
- Reduced checkout abandonment by 28% through UX improvements
- Automated inventory management saving 20 hours per week
- Scalable architecture supporting 300% business growth`,
    category: 'web',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS', 'Docker', 'Redis', 'TypeScript'],
    image: '🛒',
    liveUrl: 'https://demo-ecommerce.example.com',
    githubUrl: 'https://github.com/johndoe/ecommerce-platform',
    featured: true,
    status: 'completed',
    startDate: '2023-01-15',
    endDate: '2023-08-30',
    client: 'TechCorp Inc.',
    highlights: [
      'Handles 10K+ concurrent users',
      'Real-time inventory management',
      'Integrated payment processing',
      'Admin analytics dashboard',
      'Multi-vendor marketplace',
      'Mobile-first responsive design'
    ],
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-12-01T15:30:00Z'
  },
  {
    id: 'task-management-app',
    title: 'Task Management App',
    description: 'Collaborative project management tool with real-time updates, drag-and-drop interface, and team collaboration features.',
    longDescription: `A modern project management application designed to streamline team collaboration and boost productivity.

## Core Features
- **Real-time Collaboration**: Live updates and collaborative editing
- **Drag-and-Drop Interface**: Intuitive Kanban-style task management
- **Team Workspaces**: Organized spaces for different projects and teams
- **Advanced Filtering**: Powerful search and filter capabilities
- **Time Tracking**: Built-in time tracking and reporting tools

## Technical Architecture
- Built with React and TypeScript for type-safe development
- Socket.io for real-time communication
- MongoDB for flexible data modeling
- Express.js backend with RESTful API design
- JWT authentication with role-based access control

## Performance Metrics
- 99.9% uptime since launch
- Sub-100ms response times for all operations
- Supports teams of up to 500 members
- Real-time sync across unlimited devices`,
    category: 'web',
    technologies: ['React', 'TypeScript', 'Socket.io', 'MongoDB', 'Express', 'JWT', 'Material-UI'],
    image: '📋',
    liveUrl: 'https://taskflow-demo.example.com',
    githubUrl: 'https://github.com/johndoe/taskflow',
    featured: true,
    status: 'completed',
    startDate: '2022-09-01',
    endDate: '2023-02-28',
    highlights: [
      'Real-time collaboration',
      'Drag-and-drop interface',
      'Team workspace management',
      'Advanced filtering & search',
      'Time tracking integration',
      'Cross-platform synchronization'
    ],
    createdAt: '2022-09-01T08:00:00Z',
    updatedAt: '2023-11-15T12:45:00Z'
  },
  {
    id: 'mobile-banking-app',
    title: 'Mobile Banking App',
    description: 'React Native mobile application for digital banking with biometric authentication, transaction history, and bill payments.',
    longDescription: `A secure and user-friendly mobile banking application that brings modern banking services to customers' fingertips.

## Security Features
- **Biometric Authentication**: Fingerprint and Face ID support
- **End-to-End Encryption**: All communications secured with AES-256
- **Multi-Factor Authentication**: Additional security layers for sensitive operations
- **Fraud Detection**: AI-powered transaction monitoring
- **Secure PIN Management**: Advanced PIN protection and recovery

## Banking Features
- **Account Management**: Multiple account support with real-time balances
- **Bill Payments**: Automated bill pay with scheduling options
- **Money Transfers**: Instant transfers to contacts and external accounts
- **Transaction History**: Detailed transaction tracking and categorization
- **Budget Tools**: Spending analysis and budget management

## Technical Excellence
- Built with React Native for cross-platform compatibility
- Redux for predictable state management
- Firebase for real-time data synchronization
- Native module integration for platform-specific features
- Comprehensive error handling and offline support`,
    category: 'mobile',
    technologies: ['React Native', 'TypeScript', 'Redux', 'Firebase', 'Biometric Auth', 'Plaid API'],
    image: '📱',
    liveUrl: 'https://apps.apple.com/bankapp',
    githubUrl: undefined, // Private repo
    featured: false,
    status: 'completed',
    startDate: '2022-03-01',
    endDate: '2022-12-15',
    client: 'SecureBank Ltd.',
    highlights: [
      'Biometric authentication',
      'Real-time notifications',
      'Bill payment integration',
      'Transaction analytics',
      'Offline functionality',
      'Cross-platform compatibility'
    ],
    createdAt: '2022-03-01T09:00:00Z',
    updatedAt: '2023-10-20T14:20:00Z'
  },
  {
    id: 'api-gateway-service',
    title: 'API Gateway Service',
    description: 'Microservices API gateway with rate limiting, authentication, request routing, and comprehensive logging.',
    longDescription: `A robust API gateway service designed to handle enterprise-scale microservices architecture with security and performance in mind.

## Gateway Features
- **Request Routing**: Intelligent routing based on various criteria
- **Rate Limiting**: Configurable rate limiting per client/endpoint
- **Authentication & Authorization**: JWT and OAuth 2.0 support
- **Load Balancing**: Distribute traffic across service instances
- **Circuit Breaker**: Fault tolerance with automatic failover

## Monitoring & Analytics
- **Comprehensive Logging**: Detailed request/response logging
- **Real-time Metrics**: Performance monitoring and alerting
- **Health Checks**: Automatic service health monitoring
- **Analytics Dashboard**: Visual insights into API usage
- **Error Tracking**: Centralized error collection and analysis

## DevOps Integration
- **Docker Containerization**: Easy deployment and scaling
- **Kubernetes Ready**: Native Kubernetes support
- **CI/CD Integration**: Automated testing and deployment
- **Configuration Management**: Environment-based configuration
- **Blue-Green Deployment**: Zero-downtime deployment strategies`,
    category: 'backend',
    technologies: ['Node.js', 'Docker', 'Redis', 'JWT', 'Nginx', 'Kubernetes', 'Prometheus', 'Grafana'],
    image: '🔧',
    liveUrl: undefined,
    githubUrl: 'https://github.com/johndoe/api-gateway',
    featured: false,
    status: 'completed',
    startDate: '2021-11-01',
    endDate: '2022-04-30',
    highlights: [
      'Rate limiting & throttling',
      'JWT authentication',
      'Request routing',
      'Comprehensive logging',
      'Load balancing',
      'Circuit breaker pattern'
    ],
    createdAt: '2021-11-01T10:30:00Z',
    updatedAt: '2023-09-12T11:15:00Z'
  },
  {
    id: 'analytics-dashboard',
    title: 'Data Analytics Dashboard',
    description: 'Interactive dashboard for business intelligence with real-time data visualization, custom reports, and export capabilities.',
    longDescription: `A powerful business intelligence dashboard that transforms complex data into actionable insights through interactive visualizations.

## Visualization Features
- **Interactive Charts**: Dynamic charts with drill-down capabilities
- **Real-time Updates**: Live data streaming and automatic refreshing
- **Custom Dashboards**: Drag-and-drop dashboard builder
- **Multi-source Integration**: Connect to various data sources
- **Mobile Responsive**: Access insights from any device

## Reporting Capabilities
- **Custom Reports**: Build reports with visual query builder
- **Scheduled Reports**: Automated report generation and delivery
- **Export Options**: PDF, Excel, CSV, and PowerPoint exports
- **Data Filters**: Advanced filtering and segmentation
- **Collaboration Tools**: Share and collaborate on reports

## Technical Performance
- **Fast Query Processing**: Optimized for large datasets
- **Caching Strategy**: Intelligent caching for improved performance
- **Scalable Architecture**: Handles millions of data points
- **API-First Design**: RESTful API for external integrations
- **Security**: Role-based access control and data encryption`,
    category: 'web',
    technologies: ['Vue.js', 'D3.js', 'Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Chart.js', 'WebSocket'],
    image: '📊',
    liveUrl: 'https://analytics-demo.example.com',
    githubUrl: 'https://github.com/johndoe/analytics-dashboard',
    featured: true,
    status: 'completed',
    startDate: '2021-06-01',
    endDate: '2021-12-20',
    highlights: [
      'Real-time data visualization',
      'Custom report builder',
      'Export to multiple formats',
      'Interactive charts & graphs',
      'Multi-source integration',
      'Mobile-responsive design'
    ],
    createdAt: '2021-06-01T14:00:00Z',
    updatedAt: '2023-08-05T16:45:00Z'
  },
  {
    id: 'ai-chat-assistant',
    title: 'AI Chat Assistant',
    description: 'Intelligent chatbot with natural language processing, context awareness, and integration with multiple platforms.',
    longDescription: `An advanced AI-powered chat assistant that provides intelligent, context-aware responses across multiple platforms and use cases.

## AI Capabilities
- **Natural Language Processing**: Advanced NLP for understanding user intent
- **Context Awareness**: Maintains conversation context across sessions
- **Multi-language Support**: Supports 15+ languages with automatic detection
- **Learning Algorithms**: Continuously improves through user interactions
- **Sentiment Analysis**: Understands and responds to emotional context

## Integration Features
- **Multi-platform Support**: Works on web, mobile, Slack, Discord, and more
- **API Integration**: Connects with CRM, support systems, and databases
- **Custom Training**: Train on specific domain knowledge and data
- **Webhook Support**: Real-time notifications and integrations
- **Analytics Dashboard**: Track performance and user satisfaction

## Technical Innovation
- **TensorFlow Integration**: Custom neural networks for text processing
- **Real-time Processing**: Sub-second response times
- **Scalable Architecture**: Handles thousands of concurrent conversations
- **Docker Deployment**: Easy deployment and scaling
- **A/B Testing**: Built-in experimentation framework`,
    category: 'ai',
    technologies: ['Python', 'TensorFlow', 'React', 'WebSocket', 'Docker', 'NLP', 'BERT', 'FastAPI'],
    image: '🤖',
    liveUrl: 'https://chatbot-demo.example.com',
    githubUrl: 'https://github.com/johndoe/ai-assistant',
    featured: false,
    status: 'in-progress',
    startDate: '2023-09-01',
    endDate: undefined,
    highlights: [
      'Natural language processing',
      'Context-aware responses',
      'Multi-platform integration',
      'Learning capabilities',
      'Sentiment analysis',
      'Real-time processing'
    ],
    createdAt: '2023-09-01T11:00:00Z',
    updatedAt: '2023-12-15T09:30:00Z'
  }
]; 