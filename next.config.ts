/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Turbopack completely to avoid build issues
  /* experimental: {
    turbopack: false,
  }, */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

module.exports = nextConfig
