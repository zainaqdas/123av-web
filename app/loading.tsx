export default function Loading() {
  return (
    <div className="animate-fade-in space-y-12">
      {/* Hero skeleton */}
      <div className="skeleton h-64 w-full" />

      {/* Category pills skeleton */}
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton h-9 w-24 rounded-full" />
        ))}
      </div>

      {/* Video grid skeleton */}
      <section>
        <div className="skeleton h-8 w-48 mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="skeleton aspect-[2/3] w-full" />
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-3 w-1/2" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
