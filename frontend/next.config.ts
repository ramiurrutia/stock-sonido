import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'stock-sonido-production.up.railway.app/',
        port: '8080',
        pathname: '/assets/**',
      },
    ],
  },
};

export default nextConfig;