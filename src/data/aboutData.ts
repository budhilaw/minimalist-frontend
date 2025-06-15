export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  period: string;
  achievements: string[];
  technologies: string[];
  current: boolean;
  order: number;
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: string[];
  order: number;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  period: string;
  description?: string;
  gpa?: string;
  honors?: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  username: string;
  active: boolean;
}

export interface AboutData {
  personalInfo: {
    name: string;
    title: string;
    location: string;
    email: string;
    phone?: string;
    bio: string;
    tagline: string;
    experience: string;
    profileImage?: string;
  };
  coreValues: string[];
  workHistory: WorkExperience[];
  skills: SkillCategory[];
  education: Education[];
  certifications: Certification[];
  socialLinks: SocialLink[];
  updatedAt: string;
}

export const aboutData: AboutData = {
  personalInfo: {
    name: 'Ericsson Budhilaw',
    title: 'Full-Stack Software Engineer',
    location: 'East Java, Indonesia',
    email: 'ericsson@budhilaw.com',
    phone: '+62 812 3456 7890',
    bio: `I'm Ericsson Budhilaw, a seasoned full-stack software engineer with over 6 years of professional experience 
    delivering high-performance, end-to-end software solutions. Based in East Java, Indonesia, I've 
    built a reputation for excellence in both frontend and backend engineering, with growing experience in cloud infrastructure.

    My expertise spans the complete development stack - from crafting intuitive user interfaces with ReactJS, 
    VueJS, and NextJS on the frontend, to building robust backend systems using Go, JavaScript, Rust, Python, and PHP. 
    I have hands-on experience working with cloud services on AWS and GCP, continuously learning and improving my infrastructure skills.

    Currently expanding my horizons in emerging technologies, I'm actively building Web3 applications 
    and diving deep into AI engineering. My passion for continuous learning and full-stack development 
    drives me to stay at the forefront of technology, ensuring I deliver cutting-edge solutions that 
    meet modern business challenges from frontend to backend.`,
    tagline: 'My journey in full-stack software engineering and what drives me to create exceptional solutions',
    experience: '6+ years',
    profileImage: undefined
  },
  coreValues: [
    'Full-stack excellence - delivering seamless end-to-end user experiences',
    'Performance-first approach - optimizing both frontend UX and backend efficiency',
    'Modern frameworks mastery - leveraging ReactJS, VueJS, and NextJS effectively',
    'Continuous learning - growing expertise in cloud infrastructure and emerging technologies'
  ],
  workHistory: [
    {
      id: 'paper-id',
      company: 'Paper.id',
      position: 'Technical Lead',
      period: '2023 - Present',
      achievements: [
        'Handle people management in Malang City for all squads.',
        'Manage core squad that handles all payments feature such as Disbursement, Top-up, Withdrawal, Payment Session (Link) etc (Backend and Frontend).',
        'Managing and Designing technical documentation for core squad and cross squad such as P2P Ledger, Fee Management, Cross Border Payment, QRIS Payment etc.',
        'Designed first team in business unit Payment Gateway from zero including job post creation, talent search, creating live code test, etc.',
        'Successfully deliver good quality service with success rate 100% of disbursement from Paper.id, helping Paper.id to reducing their biggest cost in Fintech Company.',
        'Lead development of robust payment processor systems, overseeing architecture design and implementation.',
        'Encourage Core squad for good quality code like performing unit test coverage up to 90% and 1.8% duplications codes both for Backend and Frontend using SonarQube.',
        'Designed and developed an internal tools project using Rust.',
        'Integrated the internal tools project with the OpenAI Assistant API to enhance automation capabilities.',
        'Implemented Retrieval-Augmented Generation (RAG) by integrating the internal tools project with a Vector Database (MongoDB).'
      ],
      technologies: ['AngularJS', 'Go', 'PHP', 'Rust', 'MySQL', 'Docker', 'GCP', 'Redis', 'RabbitMQ', 'OpenAI API', 'Claude API', 'MongoDB', 'SonarQube'],
      current: true,
      order: 1
    },
    {
      id: 'emtrade',
      company: 'Emtrade',
      position: 'Backend Engineer',
      period: '2021 - 2023',
      achievements: [
        'Developed some features such as Online Class, Fundamental and Analyst services',
        'Migrated from PHP to Go (Golang). Ported from Monolith Laravel to Microservice Golang.',
        'Evangelist the Test-Driven Development to Emtrade\'s engineers by creating sharing session and code review.',
        'Assisted the Head of Engineering to riset about new architecture, tracing & monitoring services and improve services performances.',
        'Assisted the Lead Engineer to refactor internal library (golib) and code review.',
        'Led an Refactor Team to migrate legacy code into Clean Code architecture with Go and improved unit test code coverage around 70% to 90%.',
        'Led an Datadog implementation for tracing & monitoring that will help engineers to debug and improve the performance of some services.',
        'Designed the new archicture for authentication process by decoupling the Admin and Member services.',
        'Worked with other technologies such as Google Cloud, Redash, Grafana and Docker.'
      ],
      technologies: ['Go', 'PHP', 'MySQL', 'Docker', 'GCP', 'Redis', 'RabbitMQ'],
      current: false,
      order: 2
    },
    {
      id: 'freelance-previous',
      company: 'Upwork (Freelance)',
      position: 'Senior Full-Stack Developer',
      period: '2018 - 2021',
      achievements: [
        'Delivered robust full-stack web applications for diverse client portfolios such as E-commerce, Company Profile, Online Travel Ticket, etc.',
        'Built modern frontend interfaces with React and Vue.js ecosystem.',
        'Specialized in PHP and WordPress development for enterprise clients.',
        'Built and maintained RESTful APIs serving millions of requests monthly for E-commerce and Online Travel Ticket.',
        'Implemented DevOps practices reducing deployment time by 70%',
        'Gained extensive experience in multiple programming languages and frameworks such as React, Vue.js, Node.js, Python, MySQL, Git, Linux, etc.'
      ],
      technologies: ['ReactJS', 'VueJS', 'PHP', 'WordPress', 'JavaScript', 'Node.js', 'Python', 'MySQL', 'Git', 'Linux', 'Docker', 'GCP', 'Redis', 'RabbitMQ', 'Go'],
      current: false,
      order: 3
    }
  ],
  skills: [
    {
      id: 'frontend',
      category: 'Frontend Technologies',
      skills: ['ReactJS', 'VueJS', 'NextJS', 'JavaScript', 'TypeScript', 'HTML5/CSS3', 'Tailwind CSS', 'Responsive Design', 'Progressive Web Apps'],
      order: 1
    },
    {
      id: 'backend',
      category: 'Backend Technologies',
      skills: ['Go', 'JavaScript', 'Rust', 'Python', 'PHP', 'Node.js', 'Ruby', 'Express.js', 'REST APIs', 'GraphQL'],
      order: 2
    },
    {
      id: 'cloud-devops',
      category: 'Cloud & DevOps',
      skills: ['AWS', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Cloud Deployment', 'Monitoring', 'Infrastructure Management'],
      order: 3
    },
    {
      id: 'database',
      category: 'Database Systems',
      skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Database Design', 'Query Optimization', 'Data Modeling'],
      order: 4
    },
    {
      id: 'emerging',
      category: 'Emerging Technologies',
      skills: ['Web3 Development', 'Blockchain', 'Smart Contracts', 'AI/ML Fundamentals', 'Machine Learning Pipelines'],
      order: 5
    }
  ],
  education: [
    {
      id: 'itats',
      institution: 'Institut Teknologi Adhi Tama Surabaya',
      degree: 'Bachelor of Informatics Engineering',
      period: '2019-2023',
      description: 'Focused on software engineering, algorithms, and database systems. Graduated with strong foundation in computer science fundamentals and practical programming experience.',
      gpa: '3.7/4.0',
      honors: ['Dean\'s List', 'Best Capstone Project Award']
    }
  ],
  certifications: [
    {
      id: 'aws-dev',
      title: 'AWS Certified Developer - Associate',
      issuer: 'Amazon Web Services',
      date: '2023-06-15',
      expiryDate: '2026-06-15',
      credentialId: 'AWS-CDA-123456',
      url: 'https://aws.amazon.com/certification/'
    },
    {
      id: 'gcp-dev',
      title: 'Google Cloud Professional Developer',
      issuer: 'Google Cloud',
      date: '2023-03-20',
      expiryDate: '2025-03-20',
      credentialId: 'GCP-PD-789012',
      url: 'https://cloud.google.com/certification'
    },
    {
      id: 'react-advanced',
      title: 'Advanced React Development',
      issuer: 'Meta',
      date: '2022-11-10',
      credentialId: 'META-REACT-345678',
      url: 'https://developers.facebook.com/docs/react'
    }
  ],
  socialLinks: [
    {
      id: 'github',
      platform: 'GitHub',
      url: 'https://github.com/budhilaw',
      username: 'budhilaw',
      active: true
    },
    {
      id: 'linkedin',
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/ericssonbudhilaw',
      username: 'ericssonbudhilaw',
      active: true
    },
    {
      id: 'x',
      platform: 'X',
      url: 'https://x.com/ericssonbudhi',
      username: 'ericssonbudhi',
      active: true
    },
    {
      id: 'facebook',
      platform: 'Facebook',
      url: 'https://facebook.com/budhilaw',
      username: 'budhilaw',
      active: true
    },
    {
      id: 'instagram',
      platform: 'Instagram',
      url: 'https://instagram.com/budhilaw',
      username: 'budhilaw',
      active: true
    },
    {
      id: 'email',
      platform: 'Email',
      url: 'mailto:ericsson@budhilaw.com',
      username: 'ericsson@budhilaw.com',
      active: true
    }
  ],
  updatedAt: '2023-12-15T10:30:00Z'
}; 