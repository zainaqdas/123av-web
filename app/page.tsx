import Link from 'next/link';
import { browseSection, getGenres } from '@/lib/api';
import { localizeUrl } from '@/lib/utils';
import VideoGrid from '@/components/VideoGrid';
import GenreBar from '@/components/GenreBar';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5 minutes

export default async function HomePage() {
  const [trending, newReleases, genres] = await Promise.all([
    browseSection('trending', 1).catch(() => null),
    browseSection('new', 1).catch(() => null),
    getGenres().catch(() => []),
  ]);

  return (
    <div className="animate-fade-in space-y-12">
      {/* Hero Section */}
      <section className="relative -mx-4 md:-mx-6 -mt-20 mb-8 px-4 md:px-6 pt-28 pb-16 bg-gradient-to-b from-accent/10 via-bg-primary to-bg-primary">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            StreamVault
          </h1>
          <p className="mt-4 text-lg text-text-secondary max-w-xl">
            Premium video streaming with a sleek, modern interface. Browse thousands of videos, discover new content, and stream in high quality.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              href="/browse/trending"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-medium px-6 py-3 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Start Watching
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 bg-bg-card hover:bg-bg-hover text-text-primary font-medium px-6 py-3 rounded-full border border-border transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Videos
            </Link>
          </div>
        </div>
      </section>

      {/* Genre/Category Bar */}
      {genres.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4 text-text-secondary">Categories</h2>
          <GenreBar genres={genres} />
        </section>
      )}

      {/* Trending Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Trending Now</h2>
            <p className="text-text-secondary text-sm mt-1">What&apos;s hot right now</p>
          </div>
          <Link
            href="/browse/trending"
            className="text-accent hover:text-accent-hover text-sm font-medium transition-colors"
          >
            View All →
          </Link>
        </div>
        {trending && trending.videos.length > 0 ? (
          <VideoGrid videos={trending.videos.slice(0, 12).map(localizeUrl)} />
        ) : (
          <p className="text-text-muted text-sm">Loading trending videos...</p>
        )}
      </section>

      {/* New Releases Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">New Releases</h2>
            <p className="text-text-secondary text-sm mt-1">Fresh content just arrived</p>
          </div>
          <Link
            href="/browse/new"
            className="text-accent hover:text-accent-hover text-sm font-medium transition-colors"
          >
            View All →
          </Link>
        </div>
        {newReleases && newReleases.videos.length > 0 ? (
          <VideoGrid videos={newReleases.videos.slice(0, 12).map(localizeUrl)} />
        ) : (
          <p className="text-text-muted text-sm">Loading new releases...</p>
        )}
      </section>

      {/* Quick Links */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Uncensored', href: '/browse/uncensored', desc: 'Raw & unfiltered' },
          { label: 'New Releases', href: '/browse/new', desc: 'Latest drops' },
          { label: 'Trending', href: '/browse/trending', desc: 'Popular now' },
          { label: 'Search All', href: '/search', desc: 'Find anything' },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-bg-card hover:bg-bg-hover border border-border rounded-xl p-5 transition-all hover:border-accent/50 group"
          >
            <h3 className="font-semibold group-hover:text-accent transition-colors">{link.label}</h3>
            <p className="text-text-muted text-sm mt-1">{link.desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
