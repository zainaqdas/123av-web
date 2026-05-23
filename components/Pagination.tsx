import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | null)[] = [];
  const delta = 2;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== null) {
      pages.push(null);
    }
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8 flex-wrap">
      {currentPage > 1 && (
        <Link href={`${basePath}?page=${currentPage - 1}`}
          className="px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-card border border-border transition-colors">
          ← Prev
        </Link>
      )}
      {pages.map((page, i) =>
        page === null ? (
          <span key={`dots-${i}`} className="px-2 text-text-muted">…</span>
        ) : (
          <Link
            key={page}
            href={`${basePath}?page=${page}`}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              page === currentPage
                ? 'bg-gradient-to-r from-accent to-accent-pink text-white shadow-md shadow-accent/20'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-card border border-border'
            }`}
          >
            {page}
          </Link>
        )
      )}
      {currentPage < totalPages && (
        <Link href={`${basePath}?page=${currentPage + 1}`}
          className="px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-card border border-border transition-colors">
          Next →
        </Link>
      )}
    </div>
  );
}
