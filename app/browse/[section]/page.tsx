import { browseSection, browseGenre, getGenres } from '@/lib/api';
import type { GenreInfo } from '@/lib/api';
import { localizeUrl } from '@/lib/utils';
import VideoGrid from '@/components/VideoGrid';
import GenreBar from '@/components/GenreBar';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

interface PageProps {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ page?: string }>;
}

const SECTION_LABELS: Record<string, string> = {
  featured: 'Featured',
  trending: 'Trending Now',
  new: 'New Releases',
  recent: 'Recent Updates',
  uncensored: 'Uncensored',
};

/** Convert a URL slug back to a genre name by matching against the genre list */
function slugToGenreName(slug: string, genres: GenreInfo[]): string | null {
  const match = genres.find((g) => g.slug === slug);
  return match ? match.name : null;
}

export async function generateMetadata({ params }: PageProps) {
  const { section } = await params;
  const label = SECTION_LABELS[section] || section.replace(/-/g, ' ');
  return { title: `${label} — Browse` };
}

export default async function BrowsePage({ params, searchParams }: PageProps) {
  const { section } = await params;
  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr || '1', 10);

  const label = SECTION_LABELS[section] || section.replace(/-/g, ' ');

  // Fetch genres once and reuse for both slug lookup and GenreBar
  let genres: GenreInfo[] = [];

  let result;
  if (['new', 'trending', 'recent', 'uncensored', 'featured'].includes(section)) {
    result = await browseSection(section, page).catch(() => null);
  } else {
    genres = await getGenres().catch(() => []);
    const genreName = slugToGenreName(section, genres);
    if (genreName) {
      result = await browseGenre(genreName, page).catch(() => null);
    } else {
      result = null;
    }
  }

  if (!result || result.videos.length === 0) {
    notFound();
  }

  // Lazy-load genres for GenreBar if not already fetched
  if (genres.length === 0) {
    genres = await getGenres().catch(() => []);
  }

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-text-muted text-sm mb-2">
          <Link href="/" className="hover:text-text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text-primary">{label}</span>
        </div>
        <h1 className="text-3xl font-bold">{label}</h1>
        <p className="text-text-secondary mt-1">
          {result.totalPages > 1
            ? `Page ${page} of ${result.totalPages} · ${result.videos.length} videos`
            : `${result.videos.length} videos`}
        </p>
      </div>

      {/* Genre Bar */}
      {genres.length > 0 && (
        <GenreBar genres={genres} active={section} />
      )}

      {/* Video Grid */}
      <VideoGrid videos={result.videos.map(localizeUrl)} />

      {/* Pagination */}
      {result.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          {page > 1 && (
            <Link
              href={`/browse/${section}?page=${page - 1}`}
              className="bg-bg-card hover:bg-bg-hover border border-border text-text-primary px-5 py-2.5 rounded-xl font-medium transition-colors"
            >
              ← Previous
            </Link>
          )}
          <span className="text-text-muted text-sm px-4">
            Page {page} of {result.totalPages}
          </span>
          {page < result.totalPages && (
            <Link
              href={`/browse/${section}?page=${page + 1}`}
              className="bg-bg-card hover:bg-bg-hover border border-border text-text-primary px-5 py-2.5 rounded-xl font-medium transition-colors"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
