import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Every route is prerendered — there are no route handlers and no
   * dynamic rendering — so the site ships as plain static files served
   * straight from Cloudflare's edge. No Worker runs on a page request,
   * which is what keeps time-to-first-byte down.
   *
   * Caching and security headers live in `public/_headers`, because
   * next.config's `headers()` does not apply to a static export.
   */
  output: "export",
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
