/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  distDir: 'docs',
  basePath: '/solana-booking-platform',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
