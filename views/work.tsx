import { fmt, getDictionary, localePath, type Locale } from "@/lib/i18n";
import { categories, categoryCover, items, toClientItem } from "@/lib/portfolio";
import { breadcrumbJsonLd, galleryJsonLd, itemImage, pageMetadata } from "@/lib/seo";
import { Chrome } from "@/components/Chrome";
import { Gallery } from "@/components/Gallery";
import { JsonLd } from "@/components/JsonLd";
import { ContactCta, PageHeader } from "@/components/Sections";

export function workMetadata(locale: Locale) {
  const t = getDictionary(locale);
  return pageMetadata({ locale, path: "/work", title: t.work.title, description: t.work.metaDescription, image: itemImage(categoryCover("landscapes")) });
}

export function WorkView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const path = "/work";
  const crumbs = [{ name: t.work.title, href: localePath(locale, path) }];

  return (
    <Chrome locale={locale} path={path}>
      <JsonLd data={[breadcrumbJsonLd([{ name: t.nav.homeCrumb, href: localePath(locale, "/") }, ...crumbs]), galleryJsonLd(locale, t.work.title, path, items)]} />
      <PageHeader locale={locale} crumbs={crumbs} title={t.work.title} intro={fmt(t.work.intro, { n: items.length })} />
      <section aria-label={t.gallery.label} className="container-x pt-12 md:pt-16">
        <Gallery
          items={items.map((i) => toClientItem(i, locale))}
          categories={categories.map((c) => ({ slug: c.slug, title: c.title[locale], count: c.count }))}
          labels={{ ...t.lightbox, open: t.gallery.open, all: t.gallery.all, filterLabel: t.gallery.filterLabel }}
          dir={locale === "he" ? "rtl" : "ltr"}
        />
      </section>
      <ContactCta t={t} locale={locale} />
    </Chrome>
  );
}
