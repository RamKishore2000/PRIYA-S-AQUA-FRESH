import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staticGenerationMaxConcurrency: 1,
  },
  output: "export",
  basePath: "/admin",
  assetPrefix: "/admin",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.priyasaquafresh.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5000",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;