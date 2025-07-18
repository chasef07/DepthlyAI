/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove the runtime config from here - it belongs in middleware.js
  experimental: {
    // Add any other experimental features you need here
    // but NOT runtime configuration
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
  