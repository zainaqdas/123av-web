import VideoGrid from '@/components/VideoGrid';
import GenreBar from '@/components/GenreBar';
import { VideoGridSkeleton } from '@/components/Skeleton';
import Pagination from '@/components/Pagination';
import { browseSection, browseGenre, getGenres } from '@/lib/api';
import { localizeUrl } from '@/lib/utils';
import Link from 'next/link';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

const BUILT_IN = ['new', 'trending', 'recent', 'uncensored', 'featured'];
const LABELS: Record<string, string> = {
  trending: 'Trending Now', new: 'New Releases', recent: 'Recently Updated',
  uncensored: 'Uncensored', featured: 'Featured',
};

interface PageProps {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { section } = await params;
  const label = LABELS[section] || section.replace(/-/g, ' ');
  return {
    title: `${label.charAt(0).toUpperCase() + label.slice(1)}`,
    description: `Browse ${label} videos on FlixRush`,
  };
}

export default async function BrowsePage({ params, searchParams }: PageProps) {
  const { section } = await params;
  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr || '1', 10) || 1;
  const isBuiltIn = BUILT_IN.includes(section);
  const label = LABELS[section] || section.replace(/-/g, ' ');

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted mb-6">
        <Link href="/" className="hover:text-text-primary transition-colors">Home</Link>
        <span>/</span>
        <span className="text-text-primary font-medium capitalize">{label}</span>
      </div>

      <h1 className="text-3xl font-bold capitalize mb-2">{label}</h1>

      {/* Genre bar for built-in sections */}
      {isBuiltIn && (
        <div className="my-5">
          <Suspense fallback={<div className="h-10 skeleton" />}>
            <GenreSection section={section} />
          </Suspense>
        </div>
      )}

      {/* Video grid */}
      <Suspense fallback={<VideoGridSkeleton count={12} />}>
        <BrowseGrid section={section} page={page} isBuiltIn={isBuiltIn} />
      </Suspense>
    </div>
  );
}

async function GenreSection({ section }: { section: string }) {
  try {
    const genres = await getGenres();
    return <GenreBar genres={genres} active={section} />;
  } catch { return null; }
}

async function BrowseGrid({ section, page, isBuiltIn }: { section: string; page: number; isBuiltIn: boolean }) {
  try {
    const result = isBuiltIn
      ? await browseSection(section, page)
      : await browseGenre(section, page);

    if (!result || result.videos.length === 0) {
      return (
        <div className="text-center py-20">
          <svg className="w-16 h-16 mx-auto mb-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <p className="text-text-muted">No videos found in this section.</p>
        </div>
      );
    }

    return (
      <>
        <p className="text-text-muted text-sm mb-5">
          {result.totalPages > 1 ? `Page ${result.currentPage} of ${result.totalPages}` : `${result.videos.length} videos`}
        </p>
        <VideoGrid videos={result.videos.map(localizeUrl)} />
        {result.totalPages > 1 && (
          <Pagination currentPage={result.currentPage} totalPages={result.totalPages} basePath={`/browse/${section}`} />
        )}
      </>
    );
  } catch {
    return (
      <div className="text-center py-20">
        <p className="text-text-muted">Failed to load videos. Please try again later.</p>
      </div>
    );
  }
}
