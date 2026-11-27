import { HERO_BASE } from "@/lib/hero-video";
import type { Metadata } from "next";
import { getDictionary, isLive, localePath, site, type Locale } from "@/lib/i18n";
import { categories, profileImage, type MediaItem } from "@/lib/portfolio";
import { jpgUrl, ogUrl } from "@/lib/media-url";
import { siteUrl } from "@/lib/site-url";

/** Site-wide defaults, set once per language in its root layout */
export function siteMetadata(locale: Locale): Metadata {
  const t = getDictionary(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t.meta.title, template: `%s · ${site.name}` },
    description: t.meta.description,
    applicationName: site.name,
    authors: [{ name: site.owner }],
    icons: {
      icon: [
        { url: "/brand/favicon.svg", type: "image/svg+xml" },
        { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: "/brand/apple-touch-icon.png",
    },
    // Search engines index the site only once NEXT_PUBLIC_SITE_LIVE=true (production, after launch)
    robots: isLive ? { index: true, follow: true } : { index: false, follow: false },
    verification: {
      google: ["W6gmGe8ExnkpEKpKgwvI3HDQG7NGrjh4hUyclOMh-6Q", "z9W4UYkbwmZiWl11_HXmKH2cxQZ7SCDD9pkl07wKr-U"],
    },
  };
}

type PageMeta = { locale: Locale; path: string; title?: string; description: string; image?: string; absoluteTitle?: string };

/** Per-page metadata: canonical + hreflang pair (he at root, en under /en) + social preview */
export function pageMetadata({ locale, path, title, description, image, absoluteTitle }: PageMeta): Metadata {
  const url = localePath(locale, path);
  const ogTitle = absoluteTitle ?? (title ? `${title} · ${site.name}` : site.name);
  const images = [{ url: image ?? `${HERO_BASE}/og.jpg`, width: 1200, height: 630 }];
  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    alternates: {
      canonical: url,
      languages: { he: localePath("he", path), en: localePath("en", path), "x-default": localePath("he", path) },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      url,
      title: ogTitle,
      description,
      locale: locale === "he" ? "he_IL" : "en_US",
      alternateLocale: locale === "he" ? "en_US" : "he_IL",
      images,
    },
    twitter: { card: "summary_large_image", title: ogTitle, description, images: images.map((i) => i.url) },
  };
}

/** Social preview of an item. Only category covers have one (see scripts/process-media.mjs). */
export const itemImage = (i: MediaItem) => ogUrl(i.img.key);
export const profileOgImage = ogUrl(profileImage.key);

/* ------------------------------------------ JSON-LD ------------------------------------------ */

const BUSINESS_ID = `${siteUrl}/#business`;
const PERSON_ID = `${siteUrl}/#omer`;

export function businessJsonLd(locale: Locale) {
  const t = getDictionary(locale);
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": BUSINESS_ID,
    name: site.name,
    alternateName: "DronISO – Drone Solutions",
    description: t.meta.description,
    url: siteUrl + localePath(locale, "/"),
    email: site.email,
    telephone: site.phoneE164,
    image: `${siteUrl}${HERO_BASE}/og.jpg`,
    logo: `${siteUrl}/brand/droniso-logo.svg`,
    areaServed: { "@type": "Country", name: "Israel" },
    knowsAbout: categories.map((c) => c.title[locale]),
    founder: { "@id": PERSON_ID },
    sameAs: [site.instagram, site.linkedin],
  };
}

export function personJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: site.owner,
    alternateName: locale === "he" ? "עומר חלד" : undefined,
    jobTitle: locale === "he" ? "צלם אווירי" : "Aerial photographer",
    worksFor: { "@id": BUSINESS_ID },
    url: siteUrl + localePath(locale, "/about"),
    image: siteUrl + jpgUrl(profileImage),
    sameAs: [site.instagram, site.linkedin],
  };
}

export function faqJsonLd(locale: Locale) {
  const t = getDictionary(locale);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function breadcrumbJsonLd(crumbs: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: siteUrl + c.href })),
  };
}

export function galleryJsonLd(locale: Locale, name: string, path: string, list: MediaItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url: siteUrl + localePath(locale, path),
    isPartOf: { "@id": BUSINESS_ID },
    hasPart: list
      .filter((i) => i.type === "image")
      .map((i) => ({
        "@type": "ImageObject",
        name: i.title[locale],
        description: i.alt[locale],
        contentUrl: siteUrl + jpgUrl(i.img),
        thumbnailUrl: siteUrl + jpgUrl(i.img, "small"),
        width: i.img.fb[i.img.fb.length - 1],
        height: Math.round((i.img.fb[i.img.fb.length - 1] * i.height) / i.width),
        creator: { "@id": PERSON_ID },
        copyrightHolder: { "@id": PERSON_ID },
        ...(i.year ? { dateCreated: String(i.year) } : {}),
      })),
  };
}
