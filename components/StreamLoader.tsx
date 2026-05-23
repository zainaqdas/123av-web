'use client';

import { useEffect, useState } from 'react';
import VideoPlayer from './VideoPlayer';

interface StreamLoaderProps {
  code: string;
  poster?: string;
  title?: string;
}

export default function StreamLoader({ code, poster, title }: StreamLoaderProps) {
  const [m3u8Url, setM3u8Url] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchStream() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/video/${encodeURIComponent(code)}`, {
          signal: AbortSignal.timeout(90000), // 90s timeout for browser extraction
        });

        if (cancelled) return;

        if (!res.ok) {
          throw new Error(`API returned ${res.status}`);
        }

        const data = await res.json();
        const url = data?.result?.m3u8Url;

        if (cancelled) return;

        if (url) {
          setM3u8Url(url);
        } else {
          setError('No stream URL available for this video.');
        }
      } catch (err: unknown) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : 'Failed to load stream';
        setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchStream();

    return () => {
      cancelled = true;
    };
  }, [code]);

  // Loading state
  if (loading) {
    return (
      <div className="video-container flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-2 border-accent/30" />
            <div className="absolute inset-0 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-text-primary font-medium">Loading stream…</p>
            <p className="text-text-muted text-xs mt-1">This may take 20–60 seconds</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="video-container flex items-center justify-center bg-black">
        <div className="text-center max-w-md px-6">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-error/10 flex items-center justify-center">
            <svg className="w-7 h-7 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-error font-medium mb-1">Stream unavailable</p>
          <p className="text-text-muted text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Stream ready
  return (
    <VideoPlayer
      m3u8Url={m3u8Url!}
      poster={poster}
      title={title}
    />
  );
}
