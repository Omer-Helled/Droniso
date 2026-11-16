import type { NextConfig } from "next";

// Hebrew is the default language and lives at the root (/, /work ...); English lives under /en.
// Pages are generated under app/[lang]; the rewrite maps root URLs to the Hebrew pages internally.
const NOT_LOCALIZED = "(?!en(?:/|$)|he(?:/|$)|api/|_next|media|brand|fonts|favicon|icon|apple-icon|robots|sitemap)";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // app/global-not-found.tsx handles URLs that match no route (the root layout lives under [lang])
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
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        { source: "/", destination: "/he" },
        { source: `/:path(${NOT_LOCALIZED}.*)`, destination: "/he/:path" },
      ],
      fallback: [],
    };
  },
  async redirects() {
    return [
      // /he/... is the internal path of the Hebrew site; the public URL has no prefix
      { source: "/he", destination: "/", permanent: true },
      { source: "/he/:path*", destination: "/:path*", permanent: true },
      // Old Wix URLs
      { source: "/home", destination: "/", permanent: true },
      { source: "/home/contact", destination: "/#contact", permanent: true },
      { source: "/home/he", destination: "/", permanent: true },
      { source: "/home/he/contact", destination: "/#contact", permanent: true },
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
