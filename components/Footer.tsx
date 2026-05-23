import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-bg-secondary">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-accent to-accent-pink flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="text-sm font-semibold">
              Flix<span className="text-accent">Rush</span>
            </span>
          </div>
          <nav className="flex items-center gap-6">
            {[
              { href: '/browse/trending', label: 'Trending' },
              { href: '/browse/new', label: 'New Releases' },
              { href: '/browse/uncensored', label: 'Uncensored' },
              { href: '/search', label: 'Search' },
            ].map((link) => (
              <Link key={link.href} href={link.href}
                className="text-sm text-text-muted hover:text-text-secondary transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="text-xs text-text-muted">© {new Date().getFullYear()} FlixRush. For educational purposes only.</p>
        </div>
      </div>
    </footer>
  );
}
