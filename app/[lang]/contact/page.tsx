import Link from "next/link";
import { getDictionary, localePath, site } from "@/lib/i18n";
import { categories } from "@/lib/portfolio";
import { resolveLocale } from "@/lib/route";
import { breadcrumbJsonLd, businessJsonLd, pageMetadata } from "@/lib/seo";
import { Chrome } from "@/components/Chrome";
import { JsonLd } from "@/components/JsonLd";
import { AmbientVideo } from "@/components/AmbientVideo";
import { ContactForm } from "@/components/ContactForm";
import { ContactChannels } from "@/components/Sections";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">) {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale);
  return pageMetadata({ locale, path: "/contact", title: t.contact.pageTitle, description: t.contact.pageIntro });
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale);
  const crumbs = [{ name: t.contact.pageTitle, href: localePath(locale, "/contact") }];
  const projectTypes = [
    ...categories.map((c) => ({ value: c.slug, label: c.title[locale] })),
    { value: "other", label: t.form.other },
  ];

  return (
    <Chrome locale={locale} path="/contact" overHero>
      <JsonLd data={[businessJsonLd(locale), breadcrumbJsonLd([{ name: t.nav.homeCrumb, href: localePath(locale, "/") }, ...crumbs])]} />
      <section aria-labelledby="contact-page-title" className="relative isolate min-h-[100svh]">
        <AmbientVideo pauseLabel={t.hero.pause} playLabel={t.hero.play} />
        <div className="container-x grid gap-12 pb-20 pt-[calc(var(--header-h)+clamp(40px,7vw,96px))] lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-[0.8125rem] text-text/60">
                <li>
                  <Link href={localePath(locale, "/")} className="hover:text-text">
                    {t.nav.homeCrumb}
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="text-text/80">
                  {t.contact.pageTitle}
                </li>
              </ol>
            </nav>
            <h1 id="contact-page-title" className="mt-6 text-[clamp(2.4rem,6vw,5rem)] font-light leading-[1.02] tracking-[-0.01em]">
              {t.contact.title}
            </h1>
            <p className="mt-6 max-w-[42ch] text-[1.0625rem] leading-relaxed text-text/80">{t.contact.pageIntro}</p>
            <p className="mt-12 text-[0.8125rem] text-muted">{t.contact.direct}</p>
            <div className="mt-3">
              <ContactChannels t={t} />
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ContactForm
              labels={t.form}
              projectTypes={projectTypes}
              privacyHref={localePath(locale, "/privacy")}
              whatsappNumber={site.phoneE164.replace("+", "")}
              email={site.email}
              locale={locale}
            />
          </div>
        </div>
      </section>
    </Chrome>
  );
}
