/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/index', destination: '/', permanent: true },
      { source: '/gallery.html', destination: '/gallery', permanent: true },
    ];
  },
};

module.exports = nextConfig;


