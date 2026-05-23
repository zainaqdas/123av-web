import Link from 'next/link';
import type { GenreInfo } from '@/lib/api';

interface GenreBarProps {
  genres: GenreInfo[];
  active?: string;
}

export default function GenreBar({ genres, active }: GenreBarProps) {
  const displayGenres = genres.slice(0, 15);

  return (
    <div className="flex gap-2 flex-wrap">
      {displayGenres.map((genre) => (
        <Link
          key={genre.slug}
          href={`/browse/${genre.slug}`}
          className={`genre-tag ${active === genre.slug ? 'active' : ''}`}
        >
          {genre.name}
        </Link>
      ))}
      {genres.length > 15 && (
        <span className="genre-tag text-text-muted">
          +{genres.length - 15} more
        </span>
      )}
    </div>
  );
}
