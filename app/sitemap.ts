import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";
import { localePath } from "@/lib/i18n";
import { categories } from "@/lib/portfolio";

const PATHS = ["/", "/work", ...categories.map((c) => `/work/${c.slug}`), "/about", "/contact", "/accessibility", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) =>
    (["he", "en"] as const).map((l) => ({
      url: siteUrl + localePath(l, path),
      changeFrequency: path === "/" || path.startsWith("/work") ? ("monthly" as const) : ("yearly" as const),
      priority: path === "/" ? 1 : path.startsWith("/work") ? 0.8 : 0.5,
      alternates: { languages: { he: siteUrl + localePath("he", path), en: siteUrl + localePath("en", path) } },
    })),
  );
}
