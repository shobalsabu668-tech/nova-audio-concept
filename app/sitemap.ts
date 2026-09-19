import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { products } from "@/lib/catalogue";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = getSiteUrl();
  const now = new Date();
  return [
    { url, lastModified: now, priority: 1 },
    { url: `${url}/shop`, lastModified: now, priority: 0.9 },
    ...products.map((p) => ({ url: `${url}/products/${p.handle}`, lastModified: now, priority: 0.8 })),
    { url: `${url}/about`, lastModified: now, priority: 0.5 },
    { url: `${url}/support`, lastModified: now, priority: 0.5 },
    { url: `${url}/concept`, lastModified: now, priority: 0.5 },
  ];
}
