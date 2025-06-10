export interface SocialIcon {
  platform: string;
  icon: string;
  color?: string;
  ariaLabel: string;
}

// Social media icon mapping using Simple Icons for brand icons
export const socialIconMap: Record<string, SocialIcon> = {
  github: {
    platform: 'GitHub',
    icon: 'simple-icons:github',
    color: '#181717',
    ariaLabel: 'GitHub Profile'
  },
  linkedin: {
    platform: 'LinkedIn',
    icon: 'simple-icons:linkedin',
    color: '#0A66C2',
    ariaLabel: 'LinkedIn Profile'
  },
  x: {
    platform: 'X',
    icon: 'simple-icons:x',
    color: '#000000',
    ariaLabel: 'X (Twitter) Profile'
  },
  twitter: {
    platform: 'Twitter',
    icon: 'simple-icons:x', // Use X icon for Twitter as well
    color: '#000000',
    ariaLabel: 'X (Twitter) Profile'
  },
  facebook: {
    platform: 'Facebook',
    icon: 'simple-icons:facebook',
    color: '#1877F2',
    ariaLabel: 'Facebook Profile'
  },
  instagram: {
    platform: 'Instagram',
    icon: 'simple-icons:instagram',
    color: '#E4405F',
    ariaLabel: 'Instagram Profile'
  },
  email: {
    platform: 'Email',
    icon: 'lucide:mail', // Keep Lucide for non-brand icons
    color: '#EA4335',
    ariaLabel: 'Email Contact'
  },
  website: {
    platform: 'Website',
    icon: 'lucide:globe',
    color: '#4285F4',
    ariaLabel: 'Personal Website'
  },
  youtube: {
    platform: 'YouTube',
    icon: 'simple-icons:youtube',
    color: '#FF0000',
    ariaLabel: 'YouTube Channel'
  },
  discord: {
    platform: 'Discord',
    icon: 'simple-icons:discord',
    color: '#5865F2',
    ariaLabel: 'Discord Profile'
  },
  twitch: {
    platform: 'Twitch',
    icon: 'simple-icons:twitch',
    color: '#9146FF',
    ariaLabel: 'Twitch Channel'
  },
  mastodon: {
    platform: 'Mastodon',
    icon: 'simple-icons:mastodon',
    color: '#6364FF',
    ariaLabel: 'Mastodon Profile'
  }
};

/**
 * Get social icon configuration by platform ID
 * @param platformId - The platform identifier (e.g., 'github', 'linkedin')
 * @returns SocialIcon configuration or default email icon
 */
export const getSocialIcon = (platformId: string): SocialIcon => {
  return socialIconMap[platformId.toLowerCase()] || socialIconMap.email;
};

/**
 * Get all available social platforms
 * @returns Array of platform IDs
 */
export const getAvailablePlatforms = (): string[] => {
  return Object.keys(socialIconMap);
};

/**
 * Check if a platform is supported
 * @param platformId - The platform identifier
 * @returns Boolean indicating if platform is supported
 */
export const isPlatformSupported = (platformId: string): boolean => {
  return platformId.toLowerCase() in socialIconMap;
}; 