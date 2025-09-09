import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: undefined
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  }
};

export default nextConfig;
