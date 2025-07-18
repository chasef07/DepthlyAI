/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Force Edge Runtime for middleware
    runtime: 'edge',
  },
  // Ensure webpack doesn't include Node.js polyfills
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        dns: false,
        tls: false,
        assert: false,
        path: false,
        zlib: false,
        http: false,
        https: false,
        stream: false,
        crypto: false,
        url: false,
      }
    }
    return config
  },
}

module.exports = nextConfig
  