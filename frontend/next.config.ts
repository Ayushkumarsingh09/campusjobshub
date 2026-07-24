import type { NextConfig } from 'next';

/** Static export only for production builds (Hostinger). Never during `next dev`. */
const isStaticExport =
  process.env.STATIC_EXPORT === 'true' && process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? {
        output: 'export',
        trailingSlash: true,
      }
    : {}),
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    unoptimized: isStaticExport,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '**.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
    ],
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_ENABLE_ADS: process.env.NEXT_PUBLIC_ENABLE_ADS,
  },
  async redirects() {
    return [
      { source: '/roadmaps', destination: '/prepare/roadmaps', permanent: true },
      { source: '/roadmaps/:slug', destination: '/prepare/roadmaps/:slug', permanent: true },
      { source: '/interview-questions', destination: '/prepare/interview-questions', permanent: true },
      { source: '/prepare/roadmaps/dsa-placement-prep', destination: '/prepare/roadmaps/dsa-placement-roadmap', permanent: true },
      { source: '/prepare/roadmaps/full-stack-web-development', destination: '/prepare/roadmaps/full-stack-developer-roadmap', permanent: true },
      { source: '/prepare/roadmaps/data-science-fundamentals', destination: '/prepare/roadmaps/data-science-roadmap', permanent: true },
    ];
  },
};

export default nextConfig;
