import type { NextConfig } from "next";

// Keep native thread pools small during build/start (inherited by Next's worker processes).
process.env.RAYON_NUM_THREADS ??= "2";
process.env.UV_THREADPOOL_SIZE ??= "4";

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
  experimental: {
    // Tailwind CSS is small: inline it to remove the render-blocking stylesheet request (better FCP/LCP).
    inlineCss: true,
    // Shared hosting (Hostinger) caps processes/threads per account: build with a single worker so
    // native (Rust) compilers don't abort with "non-unwinding panic" when they can't spawn threads.
    cpus: 1,
    staticGenerationMaxConcurrency: 2,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 70, 80],
    // Fewer candidate widths = shorter srcset in every page's HTML (defaults list 15 widths)
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [96, 256, 384],
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
      { source: "/same-day", destination: "/next-day-flower-delivery", permanent: true },
      { source: "/next-day", destination: "/next-day-flower-delivery", permanent: true },
      { source: "/same-day-flower-delivery", destination: "/next-day-flower-delivery", permanent: true },
      { source: "/blog/same-day-flower-delivery-guide", destination: "/blog/next-day-flower-delivery-guide", permanent: true },
      { source: "/sympathy", destination: "/sympathy-flowers", permanent: true },
      { source: "/birthday", destination: "/birthday-flowers", permanent: true },
      { source: "/funeral-flowers", destination: "/sympathy-flowers", permanent: true },
    ];
  },
};

export default nextConfig;
