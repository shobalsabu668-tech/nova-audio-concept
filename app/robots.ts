import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

/** Crawlable, but every page carries `noindex` (see app/layout.tsx). The render studio is off-limits. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/studio" }],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
