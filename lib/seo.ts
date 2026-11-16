import type { Metadata } from "next";
import { getDictionary, localePath, site, type Locale } from "@/lib/i18n";
import { categories, profileImage, type MediaItem } from "@/lib/portfolio";
import { jpgUrl, ogUrl } from "@/lib/media-url";

type PageMeta = { locale: Locale; path: string; title?: string; description: string; image?: string; absoluteTitle?: string };

/** Per-page metadata: canonical + hreflang pair (he at root, en under /en) + social preview */
export function pageMetadata({ locale, path, title, description, image, absoluteTitle }: PageMeta): Metadata {
  const url = localePath(locale, path);
  const ogTitle = absoluteTitle ?? (title ? `${title} · ${site.name}` : site.name);
  const images = [{ url: image ?? "/media/hero/og.jpg", width: 1200, height: 630 }];
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

const BUSINESS_ID = `${site.url}/#business`;
const PERSON_ID = `${site.url}/#omer`;

export function businessJsonLd(locale: Locale) {
  const t = getDictionary(locale);
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": BUSINESS_ID,
    name: site.name,
    alternateName: "DronISO – Drone Solutions",
    description: t.meta.description,
    url: site.url + localePath(locale, "/"),
    email: site.email,
    telephone: site.phoneE164,
    image: `${site.url}/media/hero/og.jpg`,
    logo: `${site.url}/brand/droniso-logo.svg`,
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
    alternateName: locale === "he" ? "עומר הלד" : undefined,
    jobTitle: locale === "he" ? "צלם אווירי" : "Aerial photographer",
    worksFor: { "@id": BUSINESS_ID },
    url: site.url + localePath(locale, "/about"),
    image: site.url + jpgUrl(profileImage),
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
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: site.url + c.href })),
  };
}

export function galleryJsonLd(locale: Locale, name: string, path: string, list: MediaItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url: site.url + localePath(locale, path),
    isPartOf: { "@id": BUSINESS_ID },
    hasPart: list
      .filter((i) => i.type === "image")
      .map((i) => ({
        "@type": "ImageObject",
        name: i.title[locale],
        description: i.alt[locale],
        contentUrl: site.url + jpgUrl(i.img),
        thumbnailUrl: site.url + jpgUrl(i.img, "small"),
        width: i.img.fb[i.img.fb.length - 1],
        height: Math.round((i.img.fb[i.img.fb.length - 1] * i.height) / i.width),
        creator: { "@id": PERSON_ID },
        copyrightHolder: { "@id": PERSON_ID },
        ...(i.year ? { dateCreated: String(i.year) } : {}),
      })),
  };
}
