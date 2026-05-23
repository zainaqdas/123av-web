import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.123av.me' },
      { protocol: 'https', hostname: '**.123av.me' },
    ],
  },
};

export default nextConfig;
