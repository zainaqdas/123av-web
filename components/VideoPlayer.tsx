'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  m3u8Url: string;
  poster?: string;
  title?: string;
}

export default function VideoPlayer({ m3u8Url, poster, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !m3u8Url) return;

    setError(null);
    setLoading(true);

    let destroyed = false;

    // Safety timeout: if HLS doesn't fire MANIFEST_PARSED within 45s, show error
    timeoutRef.current = setTimeout(() => {
      if (!destroyed) {
        setLoading(false);
        setError('Stream took too long to load. The CDN may be slow or blocking playback.');
      }
    }, 45000);

    const clearTimeout_ = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: false, // Disable web workers to avoid bundling issues
        lowLatencyMode: false,
        backBufferLength: 30,
        maxBufferLength: 30,
        debug: false, // Toggle to true for verbose HLS.js logs
      });

      hls.loadSource(m3u8Url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (destroyed) return;
        clearTimeout_();
        setLoading(false);
        video.play().catch(() => {
          // Autoplay may be blocked by browser
        });
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (destroyed) return;

        if (data.fatal) {
          clearTimeout_();
          console.error('[HLS] Fatal error:', data.type, data.details, data.reason);
          setError(`Failed to load stream: ${data.reason || 'Unknown error'}`);
          setLoading(false);

          // Attempt to recover or destroy
          if (hls && data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (hls) {
            hls.destroy();
            hlsRef.current = null;
          }
        } else {
          // Non-fatal errors — log for debugging but keep trying
          console.warn('[HLS] Non-fatal error:', data.type, data.details, data.reason);
        }
      });

      hls.on(Hls.Events.LEVEL_LOADED, () => {
        clearTimeout_();
        if (!destroyed) setLoading(false);
      });

      hlsRef.current = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = m3u8Url;

      const onLoaded = () => {
        if (destroyed) return;
        clearTimeout_();
        setLoading(false);
        video.play().catch(() => {});
      };

      video.addEventListener('loadedmetadata', onLoaded, { once: true });
      video.addEventListener('canplay', onLoaded, { once: true });
      video.addEventListener('error', () => {
        if (destroyed) return;
        clearTimeout_();
        setError('Failed to load stream via native HLS.');
        setLoading(false);
      });
    } else {
      clearTimeout_();
      setError('HLS playback is not supported in this browser.');
      setLoading(false);
    }

    return () => {
      destroyed = true;
      clearTimeout_();
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (video) {
        video.removeAttribute('src');
        video.load();
      }
    };
  }, [m3u8Url]);

  return (
    <div className="video-container relative">
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-2 border-accent/20" />
              <div className="absolute inset-0 rounded-full border-2 border-accent border-t-transparent animate-spin" />
            </div>
            <p className="text-text-muted text-sm">Loading stream…</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
          <div className="text-center max-w-sm px-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-error/10 flex items-center justify-center">
              <svg className="w-7 h-7 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-error font-medium text-sm mb-1">Playback Error</p>
            <p className="text-text-muted text-xs">{error}</p>
          </div>
        </div>
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        poster={poster}
        title={title}
        controls
        playsInline
        className={`w-full h-full ${loading || error ? 'opacity-0' : 'opacity-100'}`}
        style={{ transition: 'opacity 0.3s ease' }}
      >
        <p>Your browser does not support HTML5 video.</p>
      </video>
    </div>
  );
}
