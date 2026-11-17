import { fmt, getDictionary, localePath, site, type Locale } from "@/lib/i18n";
import { breadcrumbJsonLd, pageMetadata, personJsonLd, profileOgImage } from "@/lib/seo";
import { Chrome } from "@/components/Chrome";
import { JsonLd } from "@/components/JsonLd";
import { ContactCta, PageHeader, Process, ProfilePhoto, Services, yearsFlying } from "@/components/Sections";

const ownerName = { he: "עומר חלד", en: "Omer Helled" } as const;

export function aboutMetadata(locale: Locale) {
  const t = getDictionary(locale);
  return pageMetadata({
    locale,
    path: "/about",
    title: t.about.pageTitle,
    description: fmt(t.about.pageIntro, { since: site.flyingSince }),
    image: profileOgImage,
  });
}

export async function AboutView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const years = await yearsFlying();
  const crumbs = [{ name: t.about.pageTitle, href: localePath(locale, "/about") }];

  return (
    <Chrome locale={locale} path="/about">
      <JsonLd data={[personJsonLd(locale), breadcrumbJsonLd([{ name: t.nav.homeCrumb, href: localePath(locale, "/") }, ...crumbs])]} />
      <PageHeader locale={locale} crumbs={crumbs} title={ownerName[locale]} intro={fmt(t.about.pageIntro, { since: site.flyingSince })} />

      <section aria-labelledby="about-lead" className="container-x pt-14 md:pt-20">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <figure className="md:col-span-5" data-reveal>
            <ProfilePhoto alt={t.about.photoAlt} sizes="(min-width: 768px) 40vw, 100vw" className="aspect-[4/5]" />
            <figcaption className="telemetry mt-3">{site.owner}</figcaption>
          </figure>
          <div className="flex flex-col gap-6 md:col-span-6 md:col-start-7 md:pt-4">
            <h2 id="about-lead" className="text-[clamp(1.6rem,3vw,2.6rem)] font-light leading-[1.2]" data-reveal>
              {t.about.lead}
            </h2>
            <div className="flex max-w-[60ch] flex-col gap-4 text-text/80" data-reveal>
              {t.about.body.map((p, i) => (
                <p key={i}>{fmt(p, { years })}</p>
              ))}
              <p>{t.about.closing}</p>
            </div>
          </div>
        </div>
      </section>

      <Services t={t} locale={locale} num="01" label={t.about.whatLabel} />
      <Process t={t} num="02" />
      <ContactCta t={t} locale={locale} />
    </Chrome>
  );
}
