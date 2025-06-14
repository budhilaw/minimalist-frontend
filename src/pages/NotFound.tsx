import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useDocumentTitle } from '../utils/seo';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const [glitchActive, setGlitchActive] = useState(false);

  // Set SEO for 404 page
  useDocumentTitle('404 - Page Not Found', 'The page you are looking for could not be found.');

  // Glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  const quickLinks = [
    { path: '/', label: 'Home', icon: 'lucide:home' },
    { path: '/about', label: 'About', icon: 'lucide:user' },
    { path: '/portfolio', label: 'Portfolio', icon: 'lucide:briefcase' },
    { path: '/blog', label: 'Blog', icon: 'lucide:book-open' },
    { path: '/contact', label: 'Contact', icon: 'lucide:mail' },
  ];

  return (
    <div className="min-h-screen pt-16 bg-[rgb(var(--color-background))] flex items-center justify-center relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgb(var(--color-primary)) 1px, transparent 1px),
              linear-gradient(90deg, rgb(var(--color-primary)) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Floating Code Snippets */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-[rgb(var(--color-muted-foreground))] opacity-10 font-mono text-sm animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            {i % 3 === 0 && '{ "status": 404 }'}
            {i % 3 === 1 && 'if (page === null)'}
            {i % 3 === 2 && 'return <NotFound />'}
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* 404 Display with Glitch Effect */}
        <div className="mb-8">
          <h1 
            className={`text-8xl md:text-9xl font-black text-[rgb(var(--color-primary))] relative transition-all duration-200 ${
              glitchActive ? 'animate-pulse' : ''
            }`}
            style={{
              fontFamily: 'monospace',
              textShadow: glitchActive 
                ? '2px 0 #ff0000, -2px 0 #00ff00, 0 2px #0000ff' 
                : 'none'
            }}
          >
            404
            {glitchActive && (
              <span className="absolute inset-0 text-red-500 opacity-50 transform translate-x-1">
                404
              </span>
            )}
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[rgb(var(--color-foreground))]">
            Page Not Found
          </h2>
          <div className="max-w-2xl mx-auto space-y-2">
            <p className="text-lg text-[rgb(var(--color-muted-foreground))]">
              Looks like this page took a different path in the codebase.
            </p>
            <div className="font-mono text-sm bg-[rgb(var(--color-muted))] p-4 rounded-lg border border-[rgb(var(--color-border))] text-left">
              <span className="text-red-500">Error:</span> <span className="text-[rgb(var(--color-foreground))]">ENOENT: no such file or directory</span><br/>
              <span className="text-blue-500">Path:</span> <span className="text-[rgb(var(--color-muted-foreground))]">{window.location.pathname}</span><br/>
              <span className="text-green-500">Status:</span> <span className="text-[rgb(var(--color-foreground))]">404 Not Found</span>
            </div>
          </div>
        </div>



        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-[rgb(var(--color-primary))] text-white font-medium rounded-lg hover:bg-[rgb(var(--color-primary))]/90 transition-all duration-200 transform hover:scale-105"
            >
              <Icon icon="lucide:home" className="w-5 h-5 mr-2" />
              Return Home
            </Link>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-6 py-3 bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] border border-[rgb(var(--color-border))] font-medium rounded-lg hover:bg-[rgb(var(--color-muted))] transition-all duration-200"
            >
              <Icon icon="lucide:arrow-left" className="w-5 h-5 mr-2" />
              Go Back
            </button>
          </div>

          {/* Quick Navigation */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-[rgb(var(--color-foreground))] mb-4">
              Quick Navigation
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-2xl mx-auto">
              {quickLinks.map(({ path, label, icon }) => (
                <Link
                  key={path}
                  to={path}
                  className="flex flex-col items-center p-4 bg-[rgb(var(--color-muted))] border border-[rgb(var(--color-border))] rounded-lg hover:border-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-background))] transition-all duration-200 group"
                >
                  <Icon 
                    icon={icon} 
                    className="w-6 h-6 text-[rgb(var(--color-primary))] mb-2 group-hover:scale-110 transition-transform duration-200" 
                  />
                  <span className="text-sm font-medium text-[rgb(var(--color-foreground))]">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Developer Info */}
          <div className="mt-12 pt-8 border-t border-[rgb(var(--color-border))]">
            <p className="text-sm text-[rgb(var(--color-muted-foreground))] max-w-lg mx-auto">
              If you believe this is an error, please{' '}
              <Link 
                to="/contact" 
                className="text-[rgb(var(--color-primary))] hover:underline font-medium"
              >
                contact me
              </Link>
              {' '}and I'll fix it right away. Debug info has been logged for investigation.
            </p>
            <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-[rgb(var(--color-muted-foreground))]">
              <span>Error ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
              <span>•</span>
              <span>Timestamp: {new Date().toISOString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Corner Terminal Window */}
      <div className="absolute bottom-4 right-4 bg-[rgb(var(--color-muted))] border border-[rgb(var(--color-border))] rounded-lg p-3 font-mono text-xs max-w-xs hidden md:block">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-[rgb(var(--color-muted-foreground))]">terminal</span>
        </div>
        <div className="space-y-1 text-[rgb(var(--color-muted-foreground))]">
          <div>$ curl -I {window.location.origin}{window.location.pathname}</div>
          <div className="text-red-500">HTTP/1.1 404 Not Found</div>
          <div>$ echo "Route not found"</div>
          <div>Route not found</div>
          <div className="animate-pulse">$_</div>
        </div>
      </div>
    </div>
  );
}; 