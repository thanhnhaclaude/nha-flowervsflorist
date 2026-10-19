import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // Always put title/description/canonical in <head> (no streamed metadata) so every crawler reads it.
  htmlLimitedBots: /.*/,
  poweredByHeader: false,
  // Tailwind CSS is small: inline it to remove the render-blocking stylesheet request (better FCP/LCP).
  experimental: { inlineCss: true },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 70, 80],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
  async redirects() {
    return [
      { source: "/shop", destination: "/flowers", permanent: true },
      { source: "/same-day", destination: "/same-day-flower-delivery", permanent: true },
      { source: "/sympathy", destination: "/sympathy-flowers", permanent: true },
      { source: "/birthday", destination: "/birthday-flowers", permanent: true },
      { source: "/funeral-flowers", destination: "/sympathy-flowers", permanent: true },
    ];
  },
};

export default nextConfig;
