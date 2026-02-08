/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  distDir: 'docs',
  // No basePath for Vercel deployment
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
