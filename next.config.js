/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static optimization for Convex compatibility
  experimental: {
    serverComponentsExternalPackages: ['convex']
  }
}

module.exports = nextConfig