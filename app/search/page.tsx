import VideoGrid from '@/components/VideoGrid';
import { VideoGridSkeleton } from '@/components/Skeleton';
import { searchVideos } from '@/lib/api';
import { localizeUrl } from '@/lib/utils';
import Link from 'next/link';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps) {
  const { q } = await searchParams;
  return { title: q ? `Search: ${q}` : 'Search' };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q, page: pageStr } = await searchParams;
  const query = q?.trim();
  const page = parseInt(pageStr || '1', 10) || 1;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-8 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-text-muted mb-6">
        <Link href="/" className="hover:text-text-primary transition-colors">Home</Link>
        <span>/</span>
        <span className="text-text-primary font-medium">Search</span>
      </div>

      {/* Search header with inline search form */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Videos</h1>
        <p className="text-text-secondary mb-4">Find exactly what you&apos;re looking for</p>
        <form className="flex gap-3 max-w-md" action="/search" method="GET">
          <input
            name="q" type="text" defaultValue={query || ''}
            placeholder="Enter a video code or title…"
            className="flex-1 bg-bg-card border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-muted outline-none focus:border-accent transition-colors"
          />
          <button type="submit"
            className="px-6 py-3 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors">
            Search
          </button>
        </form>
      </div>

      {/* Results */}
      {!query ? (
        <div className="text-center py-20">
          <svg className="w-16 h-16 mx-auto mb-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-text-muted">Enter a search term above to find videos.</p>
        </div>
      ) : (
        <Suspense fallback={<VideoGridSkeleton count={12} />}>
          <SearchResults query={query} page={page} />
        </Suspense>
      )}
    </div>
  );
}

async function SearchResults({ query, page }: { query: string; page: number }) {
  try {
    const result = await searchVideos(query, page);
    if (result.videos.length === 0) {
      return (
        <div className="text-center py-20">
          <svg className="w-16 h-16 mx-auto mb-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-lg font-medium mb-1">No results found</p>
          <p className="text-text-muted">No videos matched &quot;{query}&quot;. Try a different search term.</p>
        </div>
      );
    }

    return (
      <>
        <p className="text-text-muted text-sm mb-5">{result.videos.length} results for &quot;{query}&quot;</p>
        <VideoGrid videos={result.videos.map(localizeUrl)} />
      </>
    );
  } catch {
    return <p className="text-text-muted text-center py-16">Search failed. Please try again.</p>;
  }
}
