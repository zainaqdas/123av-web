export function VideoCardSkeleton() {
  return (
    <div className="block">
      <div className="skeleton aspect-[2/3] mb-3" />
      <div className="skeleton h-4 w-3/4 mb-1.5" />
      <div className="skeleton h-3 w-1/3" />
    </div>
  );
}

export function VideoGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function VideoDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="skeleton aspect-video mb-6" style={{ borderRadius: 'var(--radius-card)' }} />
      <div className="skeleton h-8 w-2/3 mb-2" />
      <div className="skeleton h-4 w-1/4 mb-4" />
      <div className="flex gap-2 mb-8">
        <div className="skeleton h-8 w-20 rounded-full" />
        <div className="skeleton h-8 w-24 rounded-full" />
        <div className="skeleton h-8 w-28 rounded-full" />
      </div>
    </div>
  );
}
