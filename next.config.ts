import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.123av.me' },
      { protocol: 'https', hostname: '**.123av.me' },
    ],
  },
  allowedDevOrigins: [
    '3000-cs-0f9d4e90-deaf-40ea-a490-5a4d67978d16.cs-asia-southeast1-yelo.cloudshell.dev',
  ],
};

export default nextConfig;
