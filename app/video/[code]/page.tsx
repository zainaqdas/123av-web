import { getVideo, getRelatedVideos } from '@/lib/api';
import type { VideoSummary } from '@/lib/api';
import { formatDuration, localizeUrl } from '@/lib/utils';
import VideoPlayer from '@/components/VideoPlayer';
import VideoGrid from '@/components/VideoGrid';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

interface PageProps {
  params: Promise<{ code: string }>;
}

// Cache the video fetch so generateMetadata and the page share the same promise
const getCachedVideo = cache((code: string) => getVideo(code));

export async function generateMetadata({ params }: PageProps) {
  const { code } = await params;
  try {
    const video = await getCachedVideo(code);
    return {
      title: video.title,
      description: `Watch ${video.title} online. ${video.actresses.length > 0 ? `Featuring ${video.actresses.join(', ')}. ` : ''}${video.genres.length > 0 ? `Genres: ${video.genres.join(', ')}` : ''}`,
    };
  } catch {
    return { title: `Video — ${code}` };
  }
}

export default async function VideoPage({ params }: PageProps) {
  const { code } = await params;

  let video;
  let related: VideoSummary[] = [];

  try {
    [video, related] = await Promise.all([
      getCachedVideo(code),
      getRelatedVideos(code).catch(() => []),
    ]);
  } catch {
    notFound();
  }

  return (
    <div className="animate-fade-in space-y-8">
      {/* Player Section */}
      <div className="-mx-4 md:-mx-6 -mt-20 pt-20">
        <VideoPlayer
          m3u8Url={video.m3u8Url}
          poster={video.thumbnail}
          title={video.title}
        />
      </div>

      {/* Metadata Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">{video.title}</h1>
            <div className="flex items-center gap-3 mt-2 text-text-muted text-sm">
              <code className="bg-bg-card px-2 py-0.5 rounded font-mono">{video.code}</code>
              {video.publishDate && (
                <>
                  <span>·</span>
                  <span>{new Date(video.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </>
              )}
              {video.duration && (
                <>
                  <span>·</span>
                  <span>{formatDuration(video.duration)}</span>
                </>
              )}
            </div>
          </div>

          {/* Genres */}
          {video.genres.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {video.genres.map((genre) => (
                  <Link
                    key={genre}
                    href={`/browse/${encodeURIComponent(genre.toLowerCase().replace(/\s+/g, '-'))}`}
                    className="genre-tag"
                  >
                    {genre}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Actresses */}
          {video.actresses.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Cast</h3>
              <div className="flex flex-wrap gap-2">
                {video.actresses.map((actress) => (
                  <Link
                    key={actress}
                    href={`/browse/actress/${encodeURIComponent(actress.toLowerCase().replace(/\s+/g, '-'))}`}
                    className="bg-bg-card hover:bg-accent/20 hover:border-accent/50 text-text-primary text-sm px-3 py-1.5 rounded-full border border-border transition-all"
                  >
                    {actress}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Series / Manufacturer */}
          <div className="flex flex-wrap gap-6 text-sm">
            {video.series && (
              <div>
                <span className="text-text-muted">Series: </span>
                <Link href={`/browse/${encodeURIComponent(video.series.toLowerCase().replace(/\s+/g, '-'))}`} className="text-accent hover:underline font-medium">
                  {video.series}
                </Link>
              </div>
            )}
            {video.manufacturer && (
              <div>
                <span className="text-text-muted">Studio: </span>
                <Link href={`/browse/maker/${encodeURIComponent(video.manufacturer.toLowerCase().replace(/\s+/g, '-'))}`} className="text-accent hover:underline font-medium">
                  {video.manufacturer}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Thumbnail */}
          {video.thumbnail && (
            <div className="rounded-xl overflow-hidden border border-border">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full object-cover"
              />
            </div>
          )}

          {/* Quick Info */}
          <div className="bg-bg-card border border-border rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-sm text-text-secondary uppercase tracking-wider">Details</h3>
            <div className="space-y-2 text-sm">
              {video.duration && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Duration</span>
                  <span className="font-medium">{formatDuration(video.duration)}</span>
                </div>
              )}
              {video.publishDate && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Released</span>
                  <span className="font-medium">{video.publishDate}</span>
                </div>
              )}
              {video.series && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Series</span>
                  <span className="font-medium">{video.series}</span>
                </div>
              )}
              {video.manufacturer && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Studio</span>
                  <span className="font-medium">{video.manufacturer}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-text-muted">Stream</span>
                <span className={video.m3u8Url ? 'text-green-400 font-medium' : 'text-red-400'}>
                  {video.m3u8Url ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Videos */}
      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-6">Related Videos</h2>
          <VideoGrid videos={related.slice(0, 12).map(localizeUrl)} />
        </section>
      )}
    </div>
  );
}
