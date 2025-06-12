// Security utilities for admin dashboard

// Secure Token Manager (works with httpOnly cookies)
export const SecureTokenManager = {
  // No need to store/retrieve tokens manually - they're handled by httpOnly cookies
  // These methods are for compatibility with existing code
  
  setToken: (token: string): void => {
    // In secure mode, tokens are set via httpOnly cookies by the backend
    // This method is kept for backward compatibility but does nothing
    console.warn('SecureTokenManager: Tokens are managed via httpOnly cookies');
  },

  getToken: (): string | null => {
    // In secure mode, we can't access httpOnly cookies from JavaScript
    // The browser automatically sends them with requests
    return null; // Always return null since we can't access httpOnly cookies
  },

  clearToken: (): void => {
    // Tokens are cleared by calling the logout endpoint which clears the cookie
    console.warn('SecureTokenManager: Use logout endpoint to clear tokens');
  },

  isTokenValid: (): boolean => {
    // We can't validate httpOnly cookies from JavaScript
    // The backend validates them on each request
    return true; // Assume valid - backend will handle validation
  }
};

// Original Token management (for backward compatibility)
export const TokenManager = {
  // Store token securely (httpOnly would be better in real app)
  setToken: (token: string): void => {
    localStorage.setItem('admin_token', token);
    // Set expiration time (24 hours)
    const expirationTime = Date.now() + (24 * 60 * 60 * 1000);
    localStorage.setItem('admin_token_exp', expirationTime.toString());
  },

  getToken: (): string | null => {
    const token = localStorage.getItem('admin_token');
    const expiration = localStorage.getItem('admin_token_exp');
    
    if (!token || !expiration) return null;
    
    // Check if token is expired
    if (Date.now() > parseInt(expiration)) {
      TokenManager.clearToken();
      return null;
    }
    
    return token;
  },

  clearToken: (): void => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_token_exp');
    localStorage.removeItem('admin_user');
  },

  isTokenValid: (): boolean => {
    return TokenManager.getToken() !== null;
  }
};

// Password utilities (for demo purposes - use proper backend hashing in production)
export const PasswordUtils = {
  // Simple hash for demo (use bcrypt or similar in production)
  hash: async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'admin_salt_2024');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  verify: async (password: string, hash: string): Promise<boolean> => {
    const passwordHash = await PasswordUtils.hash(password);
    return passwordHash === hash;
  },

  validate: (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

// Rate limiting for login attempts
export const RateLimiter = {
  getAttempts: (identifier: string): number => {
    const attempts = localStorage.getItem(`login_attempts_${identifier}`);
    return attempts ? parseInt(attempts) : 0;
  },

  incrementAttempts: (identifier: string): void => {
    const currentAttempts = RateLimiter.getAttempts(identifier);
    localStorage.setItem(`login_attempts_${identifier}`, (currentAttempts + 1).toString());
    
    // Set expiration (15 minutes)
    const expirationTime = Date.now() + (15 * 60 * 1000);
    localStorage.setItem(`login_attempts_exp_${identifier}`, expirationTime.toString());
  },

  clearAttempts: (identifier: string): void => {
    localStorage.removeItem(`login_attempts_${identifier}`);
    localStorage.removeItem(`login_attempts_exp_${identifier}`);
  },

  // Clear all rate limiting data (for development/demo purposes)
  clearAllAttempts: (): void => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('login_attempts_') || key.startsWith('login_attempts_exp_'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  },

  isBlocked: (identifier: string, maxAttempts: number = 5): boolean => {
    const attempts = RateLimiter.getAttempts(identifier);
    const expiration = localStorage.getItem(`login_attempts_exp_${identifier}`);
    
    if (!expiration) return false;
    
    // Check if lockout period has expired
    if (Date.now() > parseInt(expiration)) {
      RateLimiter.clearAttempts(identifier);
      return false;
    }
    
    return attempts >= maxAttempts;
  },

  getBlockTimeRemaining: (identifier: string): number => {
    const expiration = localStorage.getItem(`login_attempts_exp_${identifier}`);
    if (!expiration) return 0;
    
    const remaining = parseInt(expiration) - Date.now();
    return Math.max(0, remaining);
  }
};

// Input sanitization
export const Sanitizer = {
  // Remove potentially dangerous characters
  sanitizeText: (input: string): string => {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim();
  },

  // Sanitize HTML content (basic)
  sanitizeHTML: (input: string): string => {
    // Allow only safe HTML tags
    const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre'];
    const sanitized = input.replace(/<(\/?(?!(?:script|object|embed|link|style|img)[^>]*>)[^>]*)>/gi, (match, tag) => {
      const tagName = tag.toLowerCase().replace(/[^a-z]/g, '');
      return allowedTags.includes(tagName) ? match : '';
    });
    
    return sanitized;
  },

  // Validate email format
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate URL format
  isValidURL: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
};

// CSRF protection utilities
export const CSRFProtection = {
  generateToken: (): string => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  setToken: (token: string): void => {
    sessionStorage.setItem('csrf_token', token);
  },

  getToken: (): string | null => {
    return sessionStorage.getItem('csrf_token');
  },

  clearToken: (): void => {
    sessionStorage.removeItem('csrf_token');
  }
};

// Session management
export const SessionManager = {
  startSession: (): void => {
    const sessionId = CSRFProtection.generateToken();
    sessionStorage.setItem('admin_session_id', sessionId);
    sessionStorage.setItem('admin_session_start', Date.now().toString());
  },

  endSession: (): void => {
    sessionStorage.clear();
    TokenManager.clearToken();
  },

  isSessionValid: (): boolean => {
    const sessionId = sessionStorage.getItem('admin_session_id');
    const sessionStart = sessionStorage.getItem('admin_session_start');
    
    if (!sessionId || !sessionStart) return false;
    
    // Session expires after 8 hours
    const sessionDuration = 8 * 60 * 60 * 1000;
    const elapsed = Date.now() - parseInt(sessionStart);
    
    if (elapsed > sessionDuration) {
      SessionManager.endSession();
      return false;
    }
    
    return true;
  },

  updateActivity: (): void => {
    if (SessionManager.isSessionValid()) {
      sessionStorage.setItem('admin_last_activity', Date.now().toString());
    }
  }
};

// Audit logging
export const AuditLogger = {
  log: (action: string, details: Record<string, any> = {}): void => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action,
      details,
      sessionId: sessionStorage.getItem('admin_session_id'),
      userAgent: navigator.userAgent
    };
    
    // Store locally for demo
    const logs = JSON.parse(localStorage.getItem('admin_audit_logs') || '[]');
    logs.push(logEntry);
    
    // Keep only last 100 logs
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100);
    }
    
    localStorage.setItem('admin_audit_logs', JSON.stringify(logs));
  },

  getLogs: (): any[] => {
    return JSON.parse(localStorage.getItem('admin_audit_logs') || '[]');
  },

  clearLogs: (): void => {
    localStorage.removeItem('admin_audit_logs');
  }
}; 