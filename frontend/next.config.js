/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/:path*',
      },
      {
        source: '/search',
        destination: 'http://127.0.0.1:8000/search',
      },
      {
        source: '/assistant/:path*',
        destination: 'http://127.0.0.1:8000/assistant/:path*',
      },
      {
        source: '/recommendations/:path*',
        destination: 'http://127.0.0.1:8000/recommendations/:path*',
      },
      {
        source: '/forecast/:path*',
        destination: 'http://127.0.0.1:8000/forecast/:path*',
      },
      {
        source: '/inventory/:path*',
        destination: 'http://127.0.0.1:8000/inventory/:path*',
      },
      {
        source: '/health',
        destination: 'http://127.0.0.1:8000/health',
      },
      {
        source: '/docs',
        destination: 'http://127.0.0.1:8000/docs',
      },
      {
        source: '/openapi.json',
        destination: 'http://127.0.0.1:8000/openapi.json',
      },
    ];
  },
};

module.exports = nextConfig;
