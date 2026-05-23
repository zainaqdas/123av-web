import HeroBanner from '@/components/HeroBanner';
import VideoGrid from '@/components/VideoGrid';
import GenreBar from '@/components/GenreBar';
import { VideoGridSkeleton } from '@/components/Skeleton';
import { browseSection, getGenres } from '@/lib/api';
import { localizeUrl } from '@/lib/utils';
import Link from 'next/link';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

export default async function HomePage() {
  return (
    <div className="animate-fade-in">
      <HeroBanner />

      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 pb-16 space-y-14">
        {/* Genres bar */}
        <Suspense fallback={<div className="h-10 skeleton" />}>
          <GenreSection />
        </Suspense>

        {/* Trending */}
        <section>
          <SectionHeader title="Trending Now" subtitle="What's hot right now" href="/browse/trending" />
          <Suspense fallback={<VideoGridSkeleton count={6} />}>
            <SectionGrid section="trending" />
          </Suspense>
        </section>

        {/* New Releases */}
        <section>
          <SectionHeader title="New Releases" subtitle="Fresh content just arrived" href="/browse/new" />
          <Suspense fallback={<VideoGridSkeleton count={6} />}>
            <SectionGrid section="new" />
          </Suspense>
        </section>

        {/* Quick Links */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Uncensored', href: '/browse/uncensored', desc: 'Raw & unfiltered', color: 'from-accent to-accent-pink' },
            { label: 'New Releases', href: '/browse/new', desc: 'Latest drops', color: 'from-accent-pink to-accent' },
            { label: 'Trending', href: '/browse/trending', desc: 'Popular now', color: 'from-accent to-accent-pink' },
            { label: 'Search All', href: '/search', desc: 'Find anything', color: 'from-accent-pink to-accent' },
          ].map((link) => (
            <Link key={link.href} href={link.href}
              className="group relative bg-bg-card hover:bg-bg-card-hover border border-border hover:border-accent/30 rounded-xl p-5 transition-all duration-200 overflow-hidden">
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${link.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <h3 className="font-semibold group-hover:text-accent transition-colors">{link.label}</h3>
              <p className="text-text-muted text-sm mt-1">{link.desc}</p>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────

function SectionHeader({ title, subtitle, href }: { title: string; subtitle: string; href: string }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-text-secondary text-sm mt-1">{subtitle}</p>
      </div>
      <Link href={href}
        className="text-accent hover:text-accent-hover text-sm font-medium transition-colors flex items-center gap-1">
        View All <span className="text-base leading-none">→</span>
      </Link>
    </div>
  );
}

async function SectionGrid({ section }: { section: string }) {
  try {
    const result = await browseSection(section, 1);
    if (result.videos.length === 0) {
      return <p className="text-text-muted text-sm">No videos found.</p>;
    }
    return <VideoGrid videos={result.videos.slice(0, 12).map(localizeUrl)} />;
  } catch {
    return <p className="text-text-muted text-sm">Could not load videos.</p>;
  }
}

async function GenreSection() {
  try {
    const genres = await getGenres();
    if (genres.length === 0) return null;
    return (
      <section>
        <h2 className="text-lg font-semibold mb-4 text-text-secondary">Categories</h2>
        <GenreBar genres={genres} />
      </section>
    );
  } catch {
    return null;
  }
}
