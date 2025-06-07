import React from 'react';
import { Code, Users, Settings, Search, Rocket, Shield } from 'lucide-react';

export const Services: React.FC = () => {
  const services = [
    {
      icon: Code,
      title: 'Full-Stack Development',
      description: 'End-to-end web applications built with modern frontend frameworks like ReactJS, VueJS, NextJS and robust backend technologies including Go, Node.js, Python, and PHP.',
      features: [
        'Frontend development with ReactJS, VueJS, NextJS',
        'Backend APIs with Go, Node.js, Python, PHP',
        'Database design and optimization',
        'Real-time applications and WebSocket implementation',
        'Progressive Web Apps (PWA) development'
      ]
    },
    {
      icon: Rocket,
      title: 'Frontend Development',
      description: 'Modern, responsive user interfaces built with cutting-edge frontend technologies. Specializing in ReactJS, VueJS, and NextJS for optimal user experience.',
      features: [
        'ReactJS application development',
        'VueJS single-page applications',
        'NextJS server-side rendering',
        'Responsive and mobile-first design',
        'State management and performance optimization'
      ]
    },
    {
      icon: Settings,
      title: 'Backend Development',
      description: 'Robust backend services and APIs built with modern technologies like Go, Node.js, and Python. Scalable solutions designed for performance and reliability.',
      features: [
        'RESTful API development',
        'Microservices architecture',
        'Database design and optimization',
        'Third-party integrations',
        'Real-time data processing'
      ]
    },
    {
      icon: Users,
      title: 'Technical Consulting',
      description: 'Expert guidance on full-stack development projects, technology choices, and system improvements. Helping teams build better software solutions from frontend to backend.',
      features: [
        'Frontend framework selection (React/Vue/Next)',
        'Backend technology stack consultation',
        'Performance troubleshooting',
        'Development best practices',
        'Team mentoring and training'
      ]
    },
    {
      icon: Search,
      title: 'System Architecture',
      description: 'Design and implement efficient full-stack system architectures that scale with your business needs. Focus on performance, maintainability, and cost-effectiveness.',
      features: [
        'Frontend architecture design',
        'Backend system architecture',
        'Database architecture planning',
        'Cloud infrastructure design',
        'Technology stack optimization'
      ]
    },
    {
      icon: Shield,
      title: 'DevOps & Deployment',
      description: 'Streamline development workflows with modern DevOps practices. Containerization, CI/CD pipelines, and automated deployment solutions for full-stack applications.',
      features: [
        'Docker containerization',
        'CI/CD pipeline setup',
        'Cloud deployment automation (AWS/GCP)',
        'Monitoring and logging implementation',
        'Infrastructure optimization'
      ]
    }
  ];

  return (
    <section id="services" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-[rgb(var(--color-foreground))] sm:text-4xl">
            Services
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-[rgb(var(--color-muted-foreground))]">
            Comprehensive full-stack development services from frontend to backend
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className="group relative bg-[rgb(var(--color-background))] p-8 rounded-lg border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))] transition-all duration-300 hover:shadow-lg"
              >
                {/* Icon */}
                <div className="flex items-center justify-center w-12 h-12 bg-[rgb(var(--color-primary))] rounded-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-[rgb(var(--color-foreground))] mb-4">
                  {service.title}
                </h3>
                <p className="text-[rgb(var(--color-muted-foreground))] mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features List */}
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-[rgb(var(--color-muted-foreground))]">
                      <span className="w-1.5 h-1.5 bg-[rgb(var(--color-accent))] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-[rgb(var(--color-muted))] rounded-lg p-8">
            <h3 className="text-2xl font-bold text-[rgb(var(--color-foreground))] mb-4">
              Ready to Build Something Great?
            </h3>
            <p className="text-[rgb(var(--color-muted-foreground))] mb-6 max-w-2xl mx-auto">
              Let's discuss your full-stack development needs and see how I can help bring your project to life. 
              From frontend interfaces to backend systems, I offer complete end-to-end solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))]/90 transition-colors duration-200"
              >
                Get Free Consultation
              </a>
              <a
                href="mailto:ericsson@budhilaw.com"
                className="inline-flex items-center justify-center px-8 py-3 border border-[rgb(var(--color-border))] text-base font-medium rounded-md text-[rgb(var(--color-foreground))] bg-transparent hover:bg-[rgb(var(--color-background))] transition-colors duration-200"
              >
                Send Message
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 