// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        module: false,
        perf_hooks: false,
      };
    }
    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.glide.page", // Ersetze mit deinen erlaubten Domains
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Optional: Kann weggelassen werden, wenn CSP verwendet wird
          },
        ],
      },
    ];
  },
};

export default nextConfig;
