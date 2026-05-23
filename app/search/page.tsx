import { searchVideos } from '@/lib/api';
import VideoGrid from '@/components/VideoGrid';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export const metadata = {
  title: 'Search Videos',
  description: 'Search the video library by title, code, actress, or keyword.',
};

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = (q || '').trim();

  let results: Awaited<ReturnType<typeof searchVideos>> | null = null;
  let error = '';

  if (query) {
    try {
      results = await searchVideos(query);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Search failed';
    }
  }

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-text-muted text-sm mb-2">
          <Link href="/" className="hover:text-text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text-primary">Search</span>
        </div>
        <h1 className="text-3xl font-bold">Search Videos</h1>
        <p className="text-text-secondary mt-1">Find videos by title, code, actress, or keyword</p>
      </div>

      {/* Search Input (for direct navigation or refinement) */}
      <form className="relative max-w-2xl">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search by video code, title, actress name..."
          className="w-full bg-bg-card border border-border rounded-2xl pl-12 pr-4 py-3.5 text-text-primary placeholder-text-muted outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-lg"
          autoFocus={!query}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent hover:bg-accent-hover text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          Search
        </button>
      </form>

      {/* Results */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">
          {error}
        </div>
      )}

      {query && !results && !error && (
        <div className="space-y-4">
          <p className="text-text-secondary">Searching...</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="skeleton aspect-[2/3] w-full" />
                <div className="skeleton h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      )}

      {results && results.videos.length > 0 && (
        <section>
          <p className="text-text-secondary mb-6">
            Found {results.videos.length} results for &ldquo;{query}&rdquo;
          </p>
          <VideoGrid videos={results.videos} />
        </section>
      )}

      {results && results.videos.length === 0 && (
        <div className="text-center py-16">
          <svg className="w-16 h-16 mx-auto text-text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h2 className="text-xl font-semibold mb-2">No results found</h2>
          <p className="text-text-secondary">
            No videos matched &ldquo;{query}&rdquo;. Try a different search term.
          </p>
        </div>
      )}

      {!query && (
        <div className="text-center py-16">
          <svg className="w-16 h-16 mx-auto text-text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h2 className="text-xl font-semibold mb-2">Search the library</h2>
          <p className="text-text-secondary">Enter a video code, title, or keyword above to find videos.</p>
        </div>
      )}
    </div>
  );
}
