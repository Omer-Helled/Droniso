import { notFound } from "next/navigation";
import { getDictionary, isLocale, localePath, site, type Locale } from "@/lib/i18n";
import { categories, items, selectedItems, toClientItem } from "@/lib/portfolio";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SelectedWork } from "@/components/SelectedWork";
import { Gallery } from "@/components/Gallery";
import { About, Contact, Faq, Footer, SectionLabel, Services } from "@/components/Sections";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const t = getDictionary(locale);
  const other: Locale = locale === "he" ? "en" : "he";
  const dir = locale === "he" ? "rtl" : "ltr";

  const nav = [
    { href: "#work", label: t.nav.work },
    { href: "#services", label: t.nav.services },
    { href: "#about", label: t.nav.about },
    { href: "#faq", label: t.nav.faq },
  ];
  const contact = { href: "#contact", label: t.nav.contact };
  const lightboxLabels = { ...t.lightbox, draft: t.gallery.draft, open: t.gallery.open };

  return (
    <>
      <a href="#main" className="sr-only z-50 bg-text px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:start-4 focus:top-4">
        {t.skip}
      </a>
      <span id="top" />
      <Header
        homeHref={localePath(locale, "/")}
        homeLabel={t.nav.home}
        nav={nav}
        contact={contact}
        langSwitch={{ href: localePath(other, "/"), label: t.nav.switchTo, short: t.nav.switchToShort, hrefLang: other }}
        menuLabel={t.nav.menu}
        closeLabel={t.nav.close}
        socials={{ whatsapp: site.whatsapp, email: site.email, instagram: site.instagram, linkedin: site.linkedin }}
      />

      <main id="main">
        <Hero
          sub={t.hero.sub}
          ctaWork={{ href: "#selected", label: t.hero.ctaWork }}
          ctaQuote={{ href: "#contact", label: t.hero.ctaQuote }}
          pauseLabel={t.hero.pause}
          playLabel={t.hero.play}
          scrollLabel={t.hero.scroll}
        />

        <About t={t} num="01" />

        <section id="selected" aria-labelledby="selected-title" className="container-x pt-[clamp(88px,10vw,144px)]">
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
          <a href="#work" className="mt-12 inline-flex items-center gap-3 border-b border-line-strong pb-1 text-[0.9375rem] hover:border-text">
            {t.selected.all}
            <span className="telemetry">{items.length}</span>
          </a>
        </section>

        <Services t={t} locale={locale} num="03" />

        <section id="work" aria-labelledby="work-title" className="container-x pt-[clamp(88px,10vw,144px)]">
          <SectionLabel num="04">
            <span id="work-title">{t.gallery.label}</span>
          </SectionLabel>
          <div className="mt-10 md:mt-14">
            <Gallery
              items={items.map((i) => toClientItem(i, locale))}
              categories={categories.map((c) => ({ slug: c.slug, title: c.title[locale], count: c.count }))}
              labels={{ ...lightboxLabels, all: t.gallery.all, filterLabel: t.gallery.filterLabel }}
              dir={dir}
            />
          </div>
        </section>

        <Faq t={t} num="05" />
        <Contact t={t} num="06" />
      </main>

      <Footer t={t} nav={[...nav, contact]} />
      <WhatsAppFloat href={site.whatsapp} label={t.contact.whatsappFloat} />
    </>
  );
}
