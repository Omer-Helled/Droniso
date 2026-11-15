import Link from "next/link";
import { getDictionary, localePath } from "@/lib/i18n";
import { items, selectedItems, toClientItem } from "@/lib/portfolio";
import { resolveLocale } from "@/lib/route";
import { businessJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { Chrome } from "@/components/Chrome";
import { Hero } from "@/components/Hero";
import { SelectedWork } from "@/components/SelectedWork";
import { JsonLd } from "@/components/JsonLd";
import { AboutTeaser, ContactCta, Faq, Process, SECTION_PAD, SectionLabel, Services } from "@/components/Sections";

export async function generateMetadata({ params }: PageProps<"/[lang]">) {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale);
  return pageMetadata({ locale, path: "/", absoluteTitle: t.meta.title, description: t.meta.description });
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale);
  const dir = locale === "he" ? "rtl" : "ltr";
  const lightboxLabels = { ...t.lightbox, draft: t.gallery.draft, open: t.gallery.open };

  return (
    <Chrome locale={locale} path="/" overHero>
      <JsonLd data={[businessJsonLd(locale), faqJsonLd(locale)]} />
      <Hero
        sub={t.hero.sub}
        ctaWork={{ href: "#selected", label: t.hero.ctaWork }}
        ctaQuote={{ href: localePath(locale, "/contact"), label: t.hero.ctaQuote }}
        pauseLabel={t.hero.pause}
        playLabel={t.hero.play}
        scrollLabel={t.hero.scroll}
      />

      <AboutTeaser t={t} locale={locale} num="01" />

      <section id="selected" aria-labelledby="selected-title" className={`container-x ${SECTION_PAD}`}>
        <SectionLabel num="02">
          <span id="selected-title">{t.selected.label}</span>
        </SectionLabel>
        <div className="mt-10 md:mt-14">
          <SelectedWork
            items={selectedItems.map((i) => toClientItem(i, locale))}
            rows={[1, 2, 1, 3, 2, 1]}
            labels={lightboxLabels}
            dir={dir}
          />
        </div>
        <Link
          href={localePath(locale, "/work")}
          className="mt-12 inline-flex items-center gap-3 border-b border-line-strong pb-1 text-[0.9375rem] hover:border-text"
        >
          {t.selected.all}
          <span className="telemetry">{items.length}</span>
        </Link>
      </section>

      <Services t={t} locale={locale} num="03" />
      <Process t={t} num="04" />
      <Faq t={t} num="05" />
      <ContactCta t={t} locale={locale} num="06" />
    </Chrome>
  );
}
