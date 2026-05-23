import Link from 'next/link';
import type { VideoSummary } from '@/lib/api';

interface VideoCardProps {
  video: VideoSummary;
  priority?: boolean;
}

export default function VideoCard({ video, priority }: VideoCardProps) {
  return (
    <Link
      href={`/video/${video.code.toLowerCase()}`}
      className="video-card group block"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[2/3] bg-bg-card rounded-xl overflow-hidden mb-3">
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title || video.code}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading={priority ? 'eager' : 'lazy'}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
        )}

        {/* Duration badge */}
        {video.duration && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-2 py-1 rounded-md">
            {video.duration}
          </span>
        )}

        {/* Hover overlay */}
        <div className="card-overlay-gradient absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Play button (appears on hover) */}
        <div className="card-overlay absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-accent/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Info */}
      <h3 className="text-sm font-medium text-text-primary line-clamp-2 group-hover:text-accent transition-colors leading-snug">
        {video.title || video.code}
      </h3>
      <p className="text-xs text-text-muted mt-1 font-mono">{video.code}</p>
    </Link>
  );
}
