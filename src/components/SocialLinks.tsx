import React from 'react';
import { Icon } from '@iconify/react';
import { getSocialIcon } from '../utils/socialIcons';

interface SocialLink {
  id: string;
  href: string;
}

interface SocialLinksProps {
  links: SocialLink[];
  size?: number;
  className?: string;
  linkClassName?: string;
  showLabels?: boolean;
  direction?: 'horizontal' | 'vertical';
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  links,
  size = 20,
  className = '',
  linkClassName = '',
  showLabels = false,
  direction = 'horizontal'
}) => {
  const containerClasses = direction === 'horizontal' 
    ? `flex space-x-4 ${className}` 
    : `flex flex-col space-y-4 ${className}`;

  const defaultLinkClasses = "text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-primary))] transition-colors duration-200";

  return (
    <div className={containerClasses}>
      {links.map((link) => {
        const socialIcon = getSocialIcon(link.id);
        return (
          <a
            key={link.id}
            href={link.href}
            target={link.href.startsWith('mailto:') ? '_self' : '_blank'}
            rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
            className={`${defaultLinkClasses} ${linkClassName} ${showLabels ? 'flex items-center' : ''}`}
            aria-label={socialIcon.ariaLabel}
            title={socialIcon.platform}
          >
            <Icon icon={socialIcon.icon} width={size} height={size} />
            {showLabels && (
              <span className={direction === 'horizontal' ? 'ml-2' : 'mt-1'}>
                {socialIcon.platform}
              </span>
            )}
          </a>
        );
      })}
    </div>
  );
};

// Note: Social links are now managed through admin settings
// and fetched from the public settings API endpoint 