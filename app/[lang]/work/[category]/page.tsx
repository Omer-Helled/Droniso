import { notFound } from "next/navigation";
import { fmt, getDictionary, localePath, type Locale } from "@/lib/i18n";
import { categories, categoryCover, itemsByCategory, toClientItem, type CategorySlug } from "@/lib/portfolio";
import { resolveLocale } from "@/lib/route";
import { breadcrumbJsonLd, galleryJsonLd, itemImage, pageMetadata } from "@/lib/seo";
import { Chrome } from "@/components/Chrome";
import { Gallery } from "@/components/Gallery";
import { JsonLd } from "@/components/JsonLd";
import { ContactCta, PageHeader, Services } from "@/components/Sections";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

async function resolve(params: Promise<{ lang: string; category: string }>) {
  const locale = await resolveLocale(params);
  const { category } = await params;
  const cat = categories.find((c) => c.slug === category);
  if (!cat) notFound();
  return { locale: locale as Locale, cat };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/work/[category]">) {
  const { locale, cat } = await resolve(params);
  const t = getDictionary(locale);
  return pageMetadata({
    locale,
    path: `/work/${cat.slug}`,
    title: cat.title[locale],
    description: t.categoryIntro[cat.slug],
    image: itemImage(categoryCover(cat.slug)),
  });
}

export default async function CategoryPage({ params }: PageProps<"/[lang]/work/[category]">) {
  const { locale, cat } = await resolve(params);
  const t = getDictionary(locale);
  const path = `/work/${cat.slug}`;
  const list = itemsByCategory(cat.slug as CategorySlug);
  const crumbs = [
    { name: t.work.title, href: localePath(locale, "/work") },
    { name: cat.title[locale], href: localePath(locale, path) },
  ];
  const num = String(categories.indexOf(cat) + 1).padStart(2, "0");

  return (
    <Chrome locale={locale} path={path}>
      <JsonLd data={[breadcrumbJsonLd([{ name: t.nav.homeCrumb, href: localePath(locale, "/") }, ...crumbs]), galleryJsonLd(locale, cat.title[locale], path, list)]} />
      <PageHeader
        locale={locale}
        crumbs={crumbs}
        title={cat.title[locale]}
        intro={t.categoryIntro[cat.slug]}
        meta={`${num} / 06 · ${fmt(t.services.works, { n: list.length }).toUpperCase()}`}
      />
      <section aria-label={cat.title[locale]} className="container-x pt-12 md:pt-16">
        <Gallery
          showFilter={false}
          items={list.map((i) => toClientItem(i, locale))}
          categories={[]}
          labels={{ ...t.lightbox, draft: t.gallery.draft, open: t.gallery.open, all: t.gallery.all, filterLabel: t.gallery.filterLabel }}
          dir={locale === "he" ? "rtl" : "ltr"}
        />
      </section>
      <Services t={t} locale={locale} num="→" label={t.work.otherCategories} exclude={cat.slug} headingId="other-title" />
      <ContactCta t={t} locale={locale} />
    </Chrome>
  );
}
