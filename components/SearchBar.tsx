'use client';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const submit = useCallback(() => {
    const q = query.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
      setOpen(false);
      setQuery('');
    }
  }, [query, router]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setOpen(false); setQuery(''); }
    if (e.key === 'Enter') submit();
  };

  return (
    <>
      {/* Desktop search icon */}
      <button onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-card border border-transparent hover:border-border transition-all duration-200">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="text-text-muted">Search…</span>
      </button>

      {/* Mobile search icon */}
      <button onClick={() => setOpen(true)}
        className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* Expanded search overlay */}
      {open && (
        <div className="fixed inset-0 z-60 flex items-start justify-center pt-20 px-4" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center bg-bg-card border border-border rounded-xl overflow-hidden shadow-2xl shadow-accent/5">
              <svg className="w-5 h-5 ml-4 text-text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Search for videos…"
                className="flex-1 bg-transparent px-3 py-4 text-text-primary placeholder-text-muted outline-none text-base"
              />
              <button onClick={submit}
                className="px-4 py-4 text-accent hover:text-accent-hover font-medium text-sm transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
