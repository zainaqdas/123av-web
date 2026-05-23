import Link from 'next/link';

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden gradient-hero">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-20 md:py-28">
        <div className="max-w-2xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Streaming Now
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none">
            Unlimited{' '}
            <span className="bg-gradient-to-r from-accent to-accent-pink bg-clip-text text-transparent">
              Streaming
            </span>
          </h1>
          <p className="mt-4 text-lg text-text-secondary max-w-lg leading-relaxed">
            Browse thousands of premium videos. Discover trending titles, explore new releases, and stream in stunning quality.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/browse/trending"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-accent to-accent-pink hover:from-accent-hover hover:to-accent-pink-hover text-white font-semibold shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all duration-200 hover:scale-105">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Start Watching
            </Link>
            <Link href="/search"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-bg-card hover:bg-bg-card-hover text-text-primary font-medium border border-border hover:border-border-light transition-all duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Videos
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-12 flex gap-8">
            {[
              { value: '10K+', label: 'Videos' },
              { value: 'HD', label: 'Quality' },
              { value: '24/7', label: 'Updates' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
                <div className="text-sm text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative gradient blobs */}
      <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none opacity-30">
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-accent/20 blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-accent-pink/15 blur-[100px]" />
      </div>
    </section>
  );
}
