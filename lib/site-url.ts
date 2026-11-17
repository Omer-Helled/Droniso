// The site's public address: used for canonical links, social previews (WhatsApp, Facebook...),
// the sitemap and structured data. Safari also uses the canonical link when a page is shared or
// added to Favorites, so it must point at the live site.
//   1. NEXT_PUBLIC_SITE_URL, if set (e.g. https://www.droniso.com once the domain points at Vercel)
//   2. otherwise the project's production domain from Vercel. It becomes the custom domain
//      automatically once one is added to the project.
//   3. otherwise (local builds) the current Vercel address
const fromVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined;

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || fromVercel || "https://droniso.vercel.app").replace(/\/+$/, "");
