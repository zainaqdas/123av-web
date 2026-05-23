import VideoPlayer from '@/components/VideoPlayer';
import VideoGrid from '@/components/VideoGrid';
import GenreBar from '@/components/GenreBar';
import { VideoDetailSkeleton, VideoGridSkeleton } from '@/components/Skeleton';
import { getVideo, getRelatedVideos, getGenres } from '@/lib/api';
import { formatDuration, localizeUrl } from '@/lib/utils';
import Link from 'next/link';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { code } = await params;
  return {
    title: code.toUpperCase(),
    description: `Watch ${code.toUpperCase()} on FlixRush`,
  };
}

export default async function VideoPage({ params }: PageProps) {
  const { code } = await params;

  return (
    <div className="animate-fade-in">
      <Suspense fallback={<VideoDetailSkeleton />}>
        <VideoContent code={code} />
      </Suspense>
    </div>
  );
}

async function VideoContent({ code }: { code: string }) {
  try {
    const video = await getVideo(code);
    const upperCode = video.code || code.toUpperCase();

    return (
      <>
        {/* Player section */}
        <section className="bg-black">
          <div className="max-w-6xl mx-auto">
            {video.m3u8Url ? (
              <VideoPlayer m3u8Url={video.m3u8Url} poster={video.thumbnail} title={video.title} />
            ) : (
              <div className="video-container flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-14 h-14 mx-auto mb-3 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-text-muted font-medium">Stream not available</p>
                  <p className="text-text-muted text-sm mt-1">The video stream could not be loaded. Try again later.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Metadata section */}
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
          {/* Back link */}
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">
                {video.title || upperCode}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted mb-4">
                <span className="font-mono text-accent font-semibold">{upperCode}</span>
                {video.publishDate && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-text-muted" />
                    <span>{new Date(video.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </>
                )}
                {video.duration && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-text-muted" />
                    <span>{formatDuration(video.duration)}</span>
                  </>
                )}
              </div>

              {/* Genres */}
              {video.genres && video.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {video.genres.map((genre) => (
                    <Link key={genre} href={`/browse/${genre.toLowerCase().replace(/\s+/g, '-')}`}
                      className="genre-tag text-xs py-1.5 px-3">
                      {genre}
                    </Link>
                  ))}
                </div>
              )}

              {/* Extra details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                {video.series && <Detail label="Series" value={video.series} />}
                {video.manufacturer && <Detail label="Studio" value={video.manufacturer} />}
                {video.actresses && video.actresses.length > 0 && (
                  <Detail label="Cast" value={video.actresses.slice(0, 3).join(', ')} />
                )}
              </div>
            </div>

            {/* Poster */}
            {video.thumbnail && (
              <div className="lg:w-64 shrink-0">
                <div className="aspect-[2/3] rounded-xl overflow-hidden bg-bg-card border border-border">
                  <img src={video.thumbnail} alt={video.title || upperCode}
                    className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related videos */}
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 pb-16">
          <h2 className="text-xl font-bold mb-5">Related Videos</h2>
          <Suspense fallback={<VideoGridSkeleton count={6} />}>
            <RelatedGrid code={code} />
          </Suspense>
        </div>
      </>
    );
  } catch {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-error/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Video Not Found</h2>
        <p className="text-text-secondary mb-6">{code.toUpperCase()} could not be loaded.</p>
        <Link href="/"
          className="inline-flex items-center px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-text-muted uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm text-text-primary">{value}</p>
    </div>
  );
}

async function RelatedGrid({ code }: { code: string }) {
  try {
    const related = await getRelatedVideos(code);
    if (related.length === 0) return <p className="text-text-muted text-sm">No related videos.</p>;
    return <VideoGrid videos={related.slice(0, 12).map(localizeUrl)} />;
  } catch {
    return <p className="text-text-muted text-sm">Could not load related videos.</p>;
  }
}
