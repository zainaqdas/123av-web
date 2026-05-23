import Link from 'next/link';
import type { GenreInfo } from '@/lib/api';

interface GenreBarProps {
  genres: GenreInfo[];
  active?: string;
}

export default function GenreBar({ genres, active }: GenreBarProps) {
  const limited = genres.slice(0, 20);

  return (
    <div className="flex flex-wrap gap-2">
      {limited.map((genre) => (
        <Link
          key={genre.slug}
          href={`/browse/${genre.slug}`}
          className={`genre-tag ${active === genre.slug ? 'active' : ''}`}
        >
          {genre.name}
        </Link>
      ))}
    </div>
  );
}
