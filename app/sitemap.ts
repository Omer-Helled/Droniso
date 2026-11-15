import type { MetadataRoute } from "next";
import { localePath, site } from "@/lib/i18n";
import { categories } from "@/lib/portfolio";

const PATHS = ["/", "/work", ...categories.map((c) => `/work/${c.slug}`), "/about", "/contact", "/accessibility", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) =>
    (["he", "en"] as const).map((l) => ({
      url: site.url + localePath(l, path),
      changeFrequency: path === "/" || path.startsWith("/work") ? ("monthly" as const) : ("yearly" as const),
      priority: path === "/" ? 1 : path.startsWith("/work") ? 0.8 : 0.5,
      alternates: { languages: { he: site.url + localePath("he", path), en: site.url + localePath("en", path) } },
    })),
  );
}
