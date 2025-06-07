import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleHomeClick = () => {
    // Always scroll to top when Home is clicked
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    setIsMenuOpen(false);
  };

  const navigation = [
    { name: 'Home', href: '/', isExternal: false },
    { name: 'About', href: '/#about', isExternal: false },
    { name: 'Portfolio', href: '/#portfolio', isExternal: false },
    { name: 'Services', href: '/#services', isExternal: false },
    { name: 'Blog', href: '/blog', isExternal: false },
    { name: 'Contact', href: '/#contact', isExternal: false },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[rgb(var(--color-background))] border-b border-[rgb(var(--color-border))] backdrop-blur-sm bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              onClick={handleHomeClick}
              className="text-2xl font-bold text-[rgb(var(--color-primary))]"
            >
              John Doe
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const isActive = item.href === '/blog' ? location.pathname.startsWith('/blog') : location.pathname === item.href;
              
              if (item.href.startsWith('/#')) {
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive 
                        ? 'text-[rgb(var(--color-primary))]' 
                        : 'text-[rgb(var(--color-foreground))] hover:text-[rgb(var(--color-primary))]'
                    }`}
                  >
                    {item.name}
                  </a>
                );
              } else if (item.href === '/') {
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={handleHomeClick}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive 
                        ? 'text-[rgb(var(--color-primary))]' 
                        : 'text-[rgb(var(--color-foreground))] hover:text-[rgb(var(--color-primary))]'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              } else {
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive 
                        ? 'text-[rgb(var(--color-primary))]' 
                        : 'text-[rgb(var(--color-foreground))] hover:text-[rgb(var(--color-primary))]'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              }
            })}
          </nav>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-[rgb(var(--color-foreground))] hover:text-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-muted))] transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-[rgb(var(--color-foreground))] hover:text-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-muted))] transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-[rgb(var(--color-border))]">
              {navigation.map((item) => {
                const isActive = item.href === '/blog' ? location.pathname.startsWith('/blog') : location.pathname === item.href;
                
                if (item.href.startsWith('/#')) {
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                        isActive 
                          ? 'text-[rgb(var(--color-primary))]' 
                          : 'text-[rgb(var(--color-foreground))] hover:text-[rgb(var(--color-primary))]'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  );
                } else if (item.href === '/') {
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={handleHomeClick}
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                        isActive 
                          ? 'text-[rgb(var(--color-primary))]' 
                          : 'text-[rgb(var(--color-foreground))] hover:text-[rgb(var(--color-primary))]'
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                } else {
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                        isActive 
                          ? 'text-[rgb(var(--color-primary))]' 
                          : 'text-[rgb(var(--color-foreground))] hover:text-[rgb(var(--color-primary))]'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  );
                }
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}; 