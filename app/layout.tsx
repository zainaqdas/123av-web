import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'StreamVault — Premium Video Streaming',
    template: '%s | StreamVault',
  },
  description: 'Browse and stream premium videos with an elegant, modern interface.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 md:px-6 pt-20 pb-12">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
