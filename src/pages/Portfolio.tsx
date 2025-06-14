import React from 'react';
import { Portfolio as PortfolioComponent } from '../components/Portfolio';

export const Portfolio: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-[rgb(var(--color-foreground))] sm:text-5xl mb-4">
              My Portfolio
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-[rgb(var(--color-muted-foreground))]">
              A showcase of my recent projects and technical achievements in full-stack development
            </p>
          </div>
          
          {/* Portfolio Content */}
          <PortfolioComponent />
        </div>
      </div>
    </div>
  );
}; 