import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // WebP only: the renders are already WebP, and the AVIF encoder hangs on
  // at least one of them at small sizes (seen with sharp on Windows).
  images: { formats: ["image/webp"] },
  experimental: {
    // drei ships a large barrel file; this keeps only what is imported.
    optimizePackageImports: ["@react-three/drei"],
    inlineCss: true,
  },
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      { source: "/renders/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
};

export default nextConfig;
