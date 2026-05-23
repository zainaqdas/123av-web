/**
 * Shared utility functions for the streaming website.
 */

import type { VideoSummary } from './api';

/**
 * Format seconds into a human-readable duration string.
 */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Truncate text to a maximum length with ellipsis.
 */
export function truncate(text: string, maxLength: number = 80): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Build a full thumbnail URL from a possibly-relative path.
 */
export function resolveThumbnail(src: string | undefined): string {
  if (!src) return '/placeholder.jpg';
  if (src.startsWith('http')) return src;
  if (src.startsWith('//')) return `https:${src}`;
  return `https://cdn.123av.me/${src.replace(/^\//, '')}`;
}

/**
 * Rewrite a VideoSummary's external URL to our internal route.
 * The scraper returns full 123av.com URLs; we rewrite them to
 * our internal Next.js routes for client-side navigation.
 */
export function localizeUrl(v: VideoSummary): VideoSummary {
  return { ...v, url: `/video/${v.code.toLowerCase()}` };
}

/**
 * Classnames helper — merge conditional class names.
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
