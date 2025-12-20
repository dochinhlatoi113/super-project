import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  devIndicators: {
    position: 'top-right', // Move indicator to top-right instead of bottom
  },
};

export default nextConfig;
