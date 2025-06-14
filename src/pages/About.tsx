import React from 'react';
import { Icon } from '@iconify/react';
import { useDocumentTitle, useSocialMeta, useStructuredData, generatePersonStructuredData } from '../utils/seo';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

export const About: React.FC = () => {
  const { settings } = useSiteSettings();

  // SEO: Set page title and meta description
  useDocumentTitle(
    'About',
    'Learn about Ericsson Budhilaw, a seasoned full-stack software engineer with 6+ years of experience in React, Go, Rust, and cloud solutions. Based in Indonesia, specializing in modern web development.'
  );

  // SEO: Set social media meta tags
  useSocialMeta({
    title: 'About Ericsson Budhilaw',
    description: 'Learn about Ericsson Budhilaw, a seasoned full-stack software engineer with 6+ years of experience in React, Go, Rust, and cloud solutions.',
    type: 'website'
  });

  // SEO: Add structured data for person
  useStructuredData(
    generatePersonStructuredData({
      name: 'Ericsson Budhilaw',
      jobTitle: 'Senior Software Engineer',
      description: 'Seasoned full-stack software engineer with 6+ years of experience delivering high-performance solutions using React, Go, Rust, and cloud technologies.',
      url: `${window.location.origin}/about`,
      image: settings?.site.photo_profile,
      sameAs: [
        settings?.site.social_media_links.github,
        settings?.site.social_media_links.linkedin,
        settings?.site.social_media_links.x,
      ].filter(Boolean) as string[]
    })
  );

  const workHistory = [
    {
      company: 'Paper.id',
      position: 'Technical Lead',
      period: '2020 - Present',
      achievements: [
        'Architected and built scalable full-stack applications handling thousands of concurrent users',
        'Developed responsive frontend interfaces using ReactJS, VueJS, and NextJS frameworks',
        'Implemented high-performance APIs and database optimization strategies with 99.9% uptime',
        'Led cross-functional teams to deliver enterprise-grade software solutions',
        'Worked with cloud infrastructure on AWS and GCP for deployment and scaling',
        'Mentored junior developers and established coding standards across the organization'
      ],
      technologies: ['AngularJS', 'Go', 'JavaScript', 'Rust', 'MySQL', 'Docker', 'GCP']
    },
    {
      company: 'Previous Companies & Freelance',
      position: 'Full-Stack & Backend Developer',
      period: '2018 - 2020',
      achievements: [
        'Delivered robust full-stack web applications for diverse client portfolios',
        'Built modern frontend interfaces with React and Vue.js ecosystem',
        'Specialized in PHP and WordPress development for enterprise clients',
        'Built and maintained RESTful APIs serving millions of requests monthly',
        'Implemented DevOps practices reducing deployment time by 70%',
        'Gained extensive experience in multiple programming languages and frameworks'
      ],
      technologies: ['ReactJS', 'VueJS', 'PHP', 'WordPress', 'JavaScript', 'Node.js', 'Python', 'MySQL', 'Git', 'Linux']
    }
  ];

  const skills = {
    'Frontend Technologies': ['ReactJS', 'VueJS', 'NextJS', 'JavaScript', 'TypeScript', 'HTML5/CSS3', 'Tailwind CSS', 'Responsive Design', 'Progressive Web Apps'],
    'Backend Technologies': ['Go', 'JavaScript', 'Rust', 'Python', 'PHP', 'Node.js', 'Ruby', 'Express.js', 'REST APIs', 'GraphQL'],
    'Cloud & DevOps': ['AWS', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Cloud Deployment', 'Monitoring', 'Infrastructure Management'],
    'Database Systems': ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Database Design', 'Query Optimization', 'Data Modeling'],
    'Emerging Technologies': ['Web3 Development', 'Blockchain', 'Smart Contracts', 'AI/ML Fundamentals', 'Machine Learning Pipelines']
  };

  return (
    <div className="min-h-screen w-full bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-[rgb(var(--color-foreground))] sm:text-5xl mb-4">
              About Me
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-[rgb(var(--color-muted-foreground))]">
              My journey in full-stack software engineering and what drives me to create exceptional solutions
            </p>
          </div>

          <div className="lg:grid lg:grid-cols-2 lg:gap-12">
            {/* Personal Story */}
            <div>
              <h2 className="text-3xl font-bold text-[rgb(var(--color-foreground))] mb-6">
                My Story
              </h2>
              <div className="prose prose-lg text-[rgb(var(--color-muted-foreground))] space-y-4">
                <p>
                  I'm Ericsson Budhilaw, a seasoned full-stack software engineer with over 6 years of professional experience 
                  delivering high-performance, end-to-end software solutions. Based in East Java, Indonesia, I've 
                  built a reputation for excellence in both frontend and backend engineering, with growing experience in cloud infrastructure.
                </p>
                <p>
                  My expertise spans the complete development stack - from crafting intuitive user interfaces with ReactJS, 
                  VueJS, and NextJS on the frontend, to building robust backend systems using Go, JavaScript, Rust, Python, and PHP. 
                  I have hands-on experience working with cloud services on AWS and GCP, continuously learning and improving my infrastructure skills.
                </p>
                <p>
                  Currently expanding my horizons in emerging technologies, I'm actively building Web3 applications 
                  and diving deep into AI engineering. My passion for continuous learning and full-stack development 
                  drives me to stay at the forefront of technology, ensuring I deliver cutting-edge solutions that 
                  meet modern business challenges from frontend to backend.
                </p>
              </div>

              {/* Core Values */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-[rgb(var(--color-foreground))] mb-4">
                  Core Values & Philosophy
                </h3>
                <div className="space-y-3">
                  {[
                    'Full-stack excellence - delivering seamless end-to-end user experiences',
                    'Performance-first approach - optimizing both frontend UX and backend efficiency',
                    'Modern frameworks mastery - leveraging ReactJS, VueJS, and NextJS effectively',
                    'Continuous learning - growing expertise in cloud infrastructure and emerging technologies'
                  ].map((value, index) => (
                    <div key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-[rgb(var(--color-accent))] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-[rgb(var(--color-muted-foreground))]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Work History Timeline */}
            <div>
              <h2 className="text-3xl font-bold text-[rgb(var(--color-foreground))] mb-6">
                Professional Experience
              </h2>
              <div className="space-y-8">
                {workHistory.map((job, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-8 h-8 bg-[rgb(var(--color-primary))] rounded-full">
                          <Icon icon="lucide:calendar" className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="bg-[rgb(var(--color-muted))] p-6 rounded-lg border border-[rgb(var(--color-border))]">
                          <h4 className="text-lg font-semibold text-[rgb(var(--color-foreground))]">
                            {job.position}
                          </h4>
                          <p className="text-[rgb(var(--color-primary))] font-medium">{job.company}</p>
                          <p className="text-sm text-[rgb(var(--color-muted-foreground))] mb-3">{job.period}</p>
                          
                          <ul className="space-y-2 mb-4">
                            {job.achievements.map((achievement, idx) => (
                              <li key={idx} className="text-sm text-[rgb(var(--color-muted-foreground))] flex items-start">
                                <span className="w-1.5 h-1.5 bg-[rgb(var(--color-accent))] rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {achievement}
                              </li>
                            ))}
                          </ul>
                          
                          <div className="flex flex-wrap gap-2">
                            {job.technologies.map((tech, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 text-xs bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] rounded border border-[rgb(var(--color-border))]"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < workHistory.length - 1 && (
                      <div className="absolute left-4 top-8 w-px h-8 bg-[rgb(var(--color-border))]"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skills & Expertise */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-[rgb(var(--color-foreground))] mb-8 text-center">
              Technical Expertise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(skills).map(([category, skillList]) => (
                <div
                  key={category}
                  className="bg-[rgb(var(--color-muted))] p-6 rounded-lg border border-[rgb(var(--color-border))]"
                >
                  <h4 className="font-semibold text-[rgb(var(--color-foreground))] mb-3">{category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {skillList.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] text-sm rounded-full border border-[rgb(var(--color-border))]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Certifications */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[rgb(var(--color-muted))] p-6 rounded-lg border border-[rgb(var(--color-border))]">
              <div className="flex items-center mb-4">
                <Icon icon="lucide:book-open" className="w-6 h-6 text-[rgb(var(--color-primary))] mr-3" />
                <h3 className="text-xl font-semibold text-[rgb(var(--color-foreground))]">Education</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-[rgb(var(--color-foreground))]">Bachelor of Informatics Engineering</p>
                  <p className="text-[rgb(var(--color-muted-foreground))]">Institut Teknologi Adhi Tama Surabaya • 2019-2023</p>
                </div>
              </div>
            </div>

            <div className="bg-[rgb(var(--color-muted))] p-6 rounded-lg border border-[rgb(var(--color-border))]">
              <div className="flex items-center mb-4">
                <Icon icon="lucide:award" className="w-6 h-6 text-[rgb(var(--color-primary))] mr-3" />
                <h3 className="text-xl font-semibold text-[rgb(var(--color-foreground))]">Achievements</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-[rgb(var(--color-foreground))]">Technical Leadership</p>
                  <p className="text-[rgb(var(--color-muted-foreground))]">Leading development teams and mentoring junior developers</p>
                </div>
                <div>
                  <p className="font-medium text-[rgb(var(--color-foreground))]">Full-Stack Expertise</p>
                  <p className="text-[rgb(var(--color-muted-foreground))]">6+ years of professional development experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 