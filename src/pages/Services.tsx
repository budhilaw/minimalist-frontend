import React from 'react';
import { Services as ServicesComponent } from '../components/Services';

export const Services: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-[rgb(var(--color-foreground))] sm:text-5xl mb-4">
              My Services
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-[rgb(var(--color-muted-foreground))]">
              Professional development services tailored to bring your ideas to life
            </p>
          </div>
          
          {/* Services Content */}
          <ServicesComponent />
        </div>
      </div>
    </div>
  );
}; 