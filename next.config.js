/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour GitHub Pages
  output: 'export',
  basePath: '/brandon-funnel',
  images: {
    unoptimized: true,
  },
  // Désactiver les trailing slashes pour GitHub Pages
  trailingSlash: true,
}

module.exports = nextConfig