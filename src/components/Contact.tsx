import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: '',
    budget: '',
    message: '',
    timeline: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        company: '',
        projectType: '',
        budget: '',
        message: '',
        timeline: ''
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'ericsson@budhilaw.com',
      href: 'mailto:ericsson@budhilaw.com'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'East Java, Indonesia (Remote)',
      href: null
    },
    {
      icon: Clock,
      label: 'Timezone',
      value: 'WIB (UTC+7)',
      href: null
    }
  ];

  return (
    <section id="contact" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-[rgb(var(--color-foreground))] sm:text-4xl">
            Let's Work Together
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-[rgb(var(--color-muted-foreground))]">
            Ready to bring your project to life? Let's discuss your requirements.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          <div>
            <h3 className="text-2xl font-bold text-[rgb(var(--color-foreground))] mb-6">
              Get In Touch
            </h3>
            <p className="text-[rgb(var(--color-muted-foreground))] mb-8 leading-relaxed">
              I'm currently available for new projects and consulting opportunities.
            </p>

            <div className="space-y-6 mb-8">
              {contactInfo.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-10 h-10 bg-[rgb(var(--color-primary))] rounded-lg">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-semibold text-[rgb(var(--color-foreground))] uppercase tracking-wider">
                        {item.label}
                      </h4>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="mt-1 text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-primary))] transition-colors duration-200"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="mt-1 text-[rgb(var(--color-muted-foreground))]">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-[rgb(var(--color-muted))] p-6 rounded-lg border border-[rgb(var(--color-border))]">
              <h4 className="text-lg font-semibold text-[rgb(var(--color-foreground))] mb-2">
                Current Availability
              </h4>
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-[rgb(var(--color-foreground))] font-medium">Available for new projects</span>
              </div>
              <p className="text-[rgb(var(--color-muted-foreground))] text-sm">
                I typically respond within 24 hours and offer free 30-minute consultation calls.
              </p>
            </div>
          </div>

          <div>
            <div className="bg-[rgb(var(--color-background))] p-8 rounded-lg border border-[rgb(var(--color-border))]">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent transition-colors duration-200"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent transition-colors duration-200"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                      Project Description *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent transition-colors duration-200"
                      placeholder="Tell me about your project..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))]/90 transition-colors duration-200"
                  >
                    <Send className="mr-2 -ml-1 w-5 h-5" />
                    Send Message
                  </button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-[rgb(var(--color-foreground))] mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-[rgb(var(--color-muted-foreground))]">
                    Thank you for reaching out. I'll get back to you within 24 hours.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 