// next.config.mjs

// LlamaIndex Plugin importieren
import withLlamaIndex from 'llamaindex/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback, // Behält alle anderen Fallback-Optionen bei
        fs: false,
        module: false,
        perf_hooks: false,
      };
    }

    return config;
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

// Die Konfiguration mit dem LlamaIndex Plugin erweitern
export default withLlamaIndex(nextConfig);