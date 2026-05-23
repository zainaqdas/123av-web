import type { VideoSummary } from './api';

/** Format seconds into a human-readable duration string. */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** Rewrite external URLs to internal Next.js routes. */
export function localizeUrl(v: VideoSummary): VideoSummary {
  return { ...v, url: `/video/${v.code.toLowerCase()}` };
}

/** Merge conditional class names. */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
