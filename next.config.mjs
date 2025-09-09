/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/do-it/:path*',
        destination: 'https://api.do-it.org/:path*',
      },
    ];
  },
};

export default nextConfig;