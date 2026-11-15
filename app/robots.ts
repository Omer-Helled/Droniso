import type { MetadataRoute } from "next";
import { isLive, site } from "@/lib/i18n";

// Until launch (NEXT_PUBLIC_SITE_LIVE=true) the whole site is kept out of search engines.
export default function robots(): MetadataRoute.Robots {
  if (!isLive) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${site.url}/sitemap.xml`, host: site.url };
}
