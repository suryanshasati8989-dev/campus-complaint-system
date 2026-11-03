/**
 * Time Calculation and Formatting Utilities for Campus Complaint System
 * 
 * Location: client/src/utils/time.js
 * 
 * Provides functions for:
 * 1. Showing relative time ago (e.g. "2 hours ago", "3 days ago")
 * 2. Calculating pending hours and days
 * 3. Tracking resolution time duration between submission and resolution
 */

/**
 * Returns a human-readable relative time string (e.g., "just now", "45 minutes ago", "2 hours ago", "3 days ago")
 * @param {string|Date} dateString - ISO date string or Date object
 * @returns {string} Human-readable time ago
 */
export function formatTimeAgo(dateString) {
  if (!dateString) return 'Unknown';
  
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = Math.max(0, now.getTime() - past.getTime());
  
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (seconds < 60) {
    return 'just now';
  } else if (minutes === 1) {
    return '1 minute ago';
  } else if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours === 1) {
    return '1 hour ago';
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else if (days === 1) {
    return '1 day ago';
  } else if (days < 7) {
    return `${days} days ago`;
  } else if (weeks === 1) {
    return '1 week ago';
  } else if (weeks < 4) {
    return `${weeks} weeks ago`;
  } else if (months === 1) {
    return '1 month ago';
  } else {
    return `${months} months ago`;
  }
}

/**
 * Calculates pending duration in hours, full days, and remaining hours
 * @param {string|Date} submittedAt 
 * @param {Date} [referenceTime=new Date()]
 * @returns {{ hours: number, fullDays: number, remainingHours: number, label: string }}
 */
export function calculatePendingDuration(submittedAt, referenceTime = new Date()) {
  const submittedTime = new Date(submittedAt);
  const diffMs = Math.max(0, referenceTime.getTime() - submittedTime.getTime());
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const fullDays = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  let label = `${hours} hrs`;
  if (fullDays > 0) {
    label = `${fullDays}d ${remainingHours}h`;
  }

  return {
    hours,
    fullDays,
    remainingHours,
    label
  };
}

/**
 * Tracks resolution time taken from when complaint was filed to when it was resolved
 * @param {string|Date} submittedAt 
 * @param {string|Date} resolvedAt 
 * @returns {{ totalHours: number, totalDays: number, formatted: string }}
 */
export function calculateResolutionDuration(submittedAt, resolvedAt) {
  if (!submittedAt || !resolvedAt) return { totalHours: 0, totalDays: 0, formatted: 'N/A' };

  const start = new Date(submittedAt).getTime();
  const end = new Date(resolvedAt).getTime();
  const diffMs = Math.max(0, end - start);

  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const totalDays = Math.floor(totalHours / 24);
  const remainingHours = totalHours % 24;

  let formatted = `${totalHours} hours`;
  if (totalDays > 0) {
    formatted = `${totalDays} day${totalDays > 1 ? 's' : ''} ${remainingHours} hr${remainingHours === 1 ? '' : 's'}`;
  }

  return {
    totalHours,
    totalDays,
    formatted
  };
}
