import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-8xl font-bold text-text-muted/20 mb-4">404</div>
      <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
      <p className="text-text-secondary mb-8">The page you&apos;re looking for doesn&apos;t exist or the content is unavailable.</p>
      <Link
        href="/"
        className="bg-accent hover:bg-accent-hover text-white font-medium px-6 py-3 rounded-full transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
