import React from 'react';
import { Icon } from '@iconify/react';
import { useActiveServices } from '../hooks/useServices';
import { LoadingSection, ErrorMessage } from './LoadingSpinner';

export const Services: React.FC = () => {
  const { services, loading, error } = useActiveServices();

  // Hide section if no services and not loading
  if (!loading && services.length === 0 && !error) {
    return null;
  }

  // Icon mapping for services
  const iconMap: Record<string, string> = {
    'code': 'lucide:code',
    'users': 'lucide:users',
    'settings': 'lucide:settings',
    'search': 'lucide:search',
    'rocket': 'lucide:rocket',
    'shield': 'lucide:shield'
  };

  // Helper function to get icon component
  const getServiceIcon = (category: string) => {
    const categoryIconMap: Record<string, string> = {
      'development': 'lucide:code',
      'consulting': 'lucide:users',
      'design': 'lucide:settings',
      'devops': 'lucide:shield',
      'default': 'lucide:rocket'
    };
    return categoryIconMap[category] || categoryIconMap.default;
  };

  // Helper function to format price
  const formatPrice = (service: any) => {
    if (!service.price_amount || !service.price_currency) {
      return 'Contact for pricing';
    }
    
    const amount = Number(service.price_amount);
    const currency = service.price_currency.toUpperCase();
    const type = service.price_type || 'custom';
    
    if (type === 'hourly') {
      return `$${amount}/${type === 'hourly' ? 'hour' : 'project'}`;
    } else if (type === 'project') {
      return `$${amount}/project`;
    } else if (type === 'fixed') {
      return `$${amount}`;
    }
    
    return 'Contact for pricing';
  };

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
        {loading ? (
          <LoadingSection message="Loading services..." />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
                <div
                  key={service.id}
                  className="group relative bg-[rgb(var(--color-background))] p-8 rounded-lg border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))] transition-all duration-300 hover:shadow-lg"
                >
                  {/* Icon */}
                  <div className="flex items-center justify-center w-12 h-12 bg-[rgb(var(--color-primary))] rounded-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon icon={getServiceIcon(service.category)} className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-[rgb(var(--color-foreground))] mb-4">
                    {service.title}
                  </h3>
                  <p className="text-[rgb(var(--color-muted-foreground))] mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features List */}
                  {service.features && service.features.length > 0 && (
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm text-[rgb(var(--color-muted-foreground))]">
                          <span className="w-1.5 h-1.5 bg-[rgb(var(--color-accent))] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Service Info */}
                  <div className="mt-auto">

                    {/* Category Badge */}
                    <div className="mb-4">
                      <span className="px-3 py-1 bg-[rgb(var(--color-muted))] text-[rgb(var(--color-foreground))] text-xs rounded-full capitalize">
                        {service.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-[rgb(var(--color-muted-foreground))]">No services available at the moment.</p>
          </div>
        )}

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