import type { NextConfig } from "next";

// Hebrew is the default language and lives at the root: app/(he). English lives under /en: app/en.
// Both are plain routes (no rewrites), so page data and prefetching behave the same on every host.

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // app/global-not-found.tsx handles URLs that match no route (each language has its own root layout)
    globalNotFound: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      // Hebrew has no prefix; send any /he/... link to the real address
      { source: "/he", destination: "/", permanent: true },
      { source: "/he/:path*", destination: "/:path*", permanent: true },
      // Old Wix URLs
      { source: "/home", destination: "/", permanent: true },
      { source: "/home/contact", destination: "/contact", permanent: true },
      { source: "/home/he", destination: "/", permanent: true },
      { source: "/home/he/contact", destination: "/contact", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
