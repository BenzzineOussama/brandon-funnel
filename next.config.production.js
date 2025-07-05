/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/brandon-funnel',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Ensure assets are properly handled
  assetPrefix: '/brandon-funnel',
}

module.exports = nextConfig