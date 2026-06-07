import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
          },
        ],
      },
    ];
  },

  // Disable Next.js image optimization if no external image service is configured
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
