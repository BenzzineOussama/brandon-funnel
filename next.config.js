/** @type {import('next').NextConfig} */
const nextConfig = {
  // For GitHub Pages deployment, uncomment these lines and update basePath:
  // output: 'export',
  // basePath: '/brandon-funnel', // Replace with your repository name
  // images: {
  //   unoptimized: true,
  // },
  
  // For Vercel deployment (default)
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig