import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The product shots are ~1.8 MB PNGs; serve AVIF first, WebP as fallback.
    formats: ["image/avif", "image/webp"],
    qualities: [75],
  },
};

export default nextConfig;
