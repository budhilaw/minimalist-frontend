import React from 'react';
import { Contact as ContactComponent } from '../components/Contact';

export const Contact: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-[rgb(var(--color-foreground))] sm:text-5xl mb-4">
              Get In Touch
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-[rgb(var(--color-muted-foreground))]">
              Ready to start your next project? Let's discuss how I can help bring your ideas to life
            </p>
          </div>
          
          {/* Contact Content */}
          <ContactComponent />
        </div>
      </div>
    </div>
  );
}; 