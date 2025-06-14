// Date and time formatting utilities for Jakarta timezone (GMT+7)
const JAKARTA_TIMEZONE = 'Asia/Jakarta';

/**
 * Format date to Jakarta timezone with various display options
 */
export const formatDate = (
  dateInput: string | Date | null | undefined,
  options: {
    includeTime?: boolean;
    dateStyle?: 'short' | 'medium' | 'long' | 'full';
    timeStyle?: 'short' | 'medium' | 'long';
    relative?: boolean;
  } = {}
): string => {
  const {
    includeTime = false,
    dateStyle = 'medium',
    timeStyle = 'short',
    relative = false
  } = options;

  // Handle null/undefined input
  if (!dateInput) {
    return 'N/A';
  }

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  
  // Handle invalid dates
  if (!date || isNaN(date.getTime())) {
    return 'Invalid date';
  }

  // For relative time (e.g., "2 hours ago")
  if (relative) {
    return formatRelativeTime(date);
  }

  // Base formatting options
  const formatOptions: Intl.DateTimeFormatOptions = {
    timeZone: JAKARTA_TIMEZONE,
    hour12: false, // Use 24-hour format
  };

  if (includeTime) {
    // Include both date and time
    switch (dateStyle) {
      case 'short':
        formatOptions.year = '2-digit';
        formatOptions.month = '2-digit';
        formatOptions.day = '2-digit';
        break;
      case 'medium':
        formatOptions.year = 'numeric';
        formatOptions.month = 'short';
        formatOptions.day = 'numeric';
        break;
      case 'long':
        formatOptions.year = 'numeric';
        formatOptions.month = 'long';
        formatOptions.day = 'numeric';
        break;
      case 'full':
        formatOptions.weekday = 'long';
        formatOptions.year = 'numeric';
        formatOptions.month = 'long';
        formatOptions.day = 'numeric';
        break;
    }

    switch (timeStyle) {
      case 'short':
        formatOptions.hour = '2-digit';
        formatOptions.minute = '2-digit';
        break;
      case 'medium':
        formatOptions.hour = '2-digit';
        formatOptions.minute = '2-digit';
        formatOptions.second = '2-digit';
        break;
      case 'long':
        formatOptions.hour = '2-digit';
        formatOptions.minute = '2-digit';
        formatOptions.second = '2-digit';
        formatOptions.timeZoneName = 'short';
        break;
    }
  } else {
    // Date only
    switch (dateStyle) {
      case 'short':
        formatOptions.year = '2-digit';
        formatOptions.month = '2-digit';
        formatOptions.day = '2-digit';
        break;
      case 'medium':
        formatOptions.year = 'numeric';
        formatOptions.month = 'short';
        formatOptions.day = 'numeric';
        break;
      case 'long':
        formatOptions.year = 'numeric';
        formatOptions.month = 'long';
        formatOptions.day = 'numeric';
        break;
      case 'full':
        formatOptions.weekday = 'long';
        formatOptions.year = 'numeric';
        formatOptions.month = 'long';
        formatOptions.day = 'numeric';
        break;
    }
  }

  return new Intl.DateTimeFormat('en-US', formatOptions).format(date);
};

/**
 * Format relative time (e.g., "2 hours ago", "3 days ago")
 */
export const formatRelativeTime = (dateInput: string | Date | null | undefined): string => {
  // Handle null/undefined input
  if (!dateInput) {
    return 'N/A';
  }

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  
  // Handle invalid dates
  if (!date || isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const now = new Date();
  
  // Convert both dates to Jakarta timezone for accurate comparison
  const jakartaDate = new Date(date.toLocaleString('en-US', { timeZone: JAKARTA_TIMEZONE }));
  const jakartaNow = new Date(now.toLocaleString('en-US', { timeZone: JAKARTA_TIMEZONE }));
  
  const diffInMinutes = Math.floor((jakartaNow.getTime() - jakartaDate.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
  
  // For older dates, show formatted date
  return formatDate(date, { dateStyle: 'medium' });
};

/**
 * Format time only in 24-hour format
 */
export const formatTime = (dateInput: string | Date | null | undefined): string => {
  // Handle null/undefined input
  if (!dateInput) {
    return 'N/A';
  }

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  
  // Handle invalid dates
  if (!date || isNaN(date.getTime())) {
    return 'Invalid time';
  }
  
  return new Intl.DateTimeFormat('en-US', {
    timeZone: JAKARTA_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
};

/**
 * Format datetime with full details
 */
export const formatDateTime = (dateInput: string | Date | null | undefined): string => {
  return formatDate(dateInput, { includeTime: true, dateStyle: 'medium', timeStyle: 'short' });
};

/**
 * Format datetime for audit logs and detailed timestamps
 */
export const formatAuditTimestamp = (dateInput: string | Date | null | undefined): string => {
  return formatDate(dateInput, { includeTime: true, dateStyle: 'long', timeStyle: 'medium' });
};

/**
 * Format date for blog posts and articles
 */
export const formatBlogDate = (dateInput: string | Date | null | undefined): string => {
  return formatDate(dateInput, { dateStyle: 'long' });
};

/**
 * Format date for admin tables and lists
 */
export const formatTableDate = (dateInput: string | Date | null | undefined): string => {
  return formatDate(dateInput, { dateStyle: 'medium' });
};

/**
 * Get current Jakarta time
 */
export const getCurrentJakartaTime = (): Date => {
  return new Date(new Date().toLocaleString('en-US', { timeZone: JAKARTA_TIMEZONE }));
};

/**
 * Format date for form inputs (YYYY-MM-DD)
 */
export const formatDateForInput = (dateInput: string | Date | null | undefined): string => {
  // Handle null/undefined input
  if (!dateInput) {
    return '';
  }

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  
  // Handle invalid dates
  if (!date || isNaN(date.getTime())) {
    return '';
  }
  
  // Convert to Jakarta timezone first
  const jakartaDate = new Date(date.toLocaleString('en-US', { timeZone: JAKARTA_TIMEZONE }));
  
  const year = jakartaDate.getFullYear();
  const month = String(jakartaDate.getMonth() + 1).padStart(2, '0');
  const day = String(jakartaDate.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}; 