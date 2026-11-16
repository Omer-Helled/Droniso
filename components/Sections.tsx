import Link from "next/link";
import { cacheLife } from "next/cache";
import type { ReactNode } from "react";
import { fmt, getDictionary, localePath, site, type Dictionary, type Locale } from "@/lib/i18n";
import { categories, categoryCover, profileImage, type CategorySlug } from "@/lib/portfolio";
import { Picture } from "@/components/Picture";
import { ArrowEnd, ArrowUpRight, Instagram, LinkedIn, Mail, Plus, WhatsApp } from "@/components/Icons";
import { LogoMark } from "@/components/brand/Logo";

export const SECTION_PAD = "pt-[clamp(88px,10vw,144px)]";

export async function currentYear() {
  "use cache";
  cacheLife("days"); // the year only changes once a year: no need to rebuild pages every few minutes
  return new Date().getFullYear();
}

export async function yearsFlying() {
  return (await currentYear()) - site.flyingSince;
}

export function SectionLabel({ num, children }: { num: string; children: ReactNode }) {
  return (
    <p className="section-label" data-reveal>
      <span className="num">{num}</span>
      <span>{children}</span>
    </p>
  );
}

/* ------------------------------------------- Page header ------------------------------------------- */

export function PageHeader({
  locale,
  crumbs,
  title,
  intro,
  meta,
}: {
  locale: Locale;
  crumbs: { name: string; href: string }[];
  title: string;
  intro?: string;
  meta?: string;
}) {
  const t = getDictionary(locale);
  return (
    <header className="container-x pt-[calc(var(--header-h)+clamp(40px,7vw,104px))]">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-[0.8125rem] text-muted">
          <li>
            <Link href={localePath(locale, "/")} className="hover:text-text">
              {t.nav.homeCrumb}
            </Link>
          </li>
          {crumbs.map((c, i) => (
            <li key={c.href} className="flex items-center gap-2">
              <span aria-hidden>/</span>
              {i === crumbs.length - 1 ? (
                <span aria-current="page" className="text-text/80">
                  {c.name}
                </span>
              ) : (
                <Link href={c.href} className="hover:text-text">
                  {c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      {/* No scroll-reveal above the fold: it would delay the first paint of the page's main content */}
      <h1 className="mt-6 text-[clamp(2.6rem,7vw,6rem)] font-light leading-[1] tracking-[-0.015em]">{title}</h1>
      {intro && (
        <p className="mt-6 max-w-[58ch] text-[1.0625rem] leading-relaxed text-text/75 sm:text-lg">
          {intro}
        </p>
      )}
      {meta && <p className="telemetry mt-5">{meta}</p>}
    </header>
  );
}

/* ----------------------------------------------- About ----------------------------------------------- */

export function ProfilePhoto({ alt, sizes, className = "" }: { alt: string; sizes: string; className?: string }) {
  return (
    <div className={`media-frame ${className}`} style={{ ["--ph-color" as string]: "#6d7e9d" }}>
      <Picture img={profileImage} sizes={sizes} alt={alt} className="!object-[42%_50%]" />
      <span className="viewfinder" aria-hidden style={{ ["--vf-inset" as string]: "12px" }} />
    </div>
  );
}

/** Home page version: the lead, the first two paragraphs and a link to the full About page */
export async function AboutTeaser({ t, locale, num }: { t: Dictionary; locale: Locale; num: string }) {
  const years = await yearsFlying();
  return (
    <section id="about" aria-labelledby="about-title" className={`container-x ${SECTION_PAD}`}>
      <SectionLabel num={num}>{t.about.label}</SectionLabel>
      <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12 md:gap-8">
        <h2 id="about-title" className="text-[clamp(1.6rem,3.4vw,3.1rem)] font-light leading-[1.18] md:col-span-8" data-reveal>
          {t.about.lead}
        </h2>
        <figure className="md:col-span-4 md:col-start-9 md:row-span-2 md:row-start-1" data-reveal style={{ ["--d" as string]: 1 }}>
          <ProfilePhoto alt={t.about.photoAlt} sizes="(min-width: 768px) 30vw, 100vw" className="aspect-[4/5]" />
          <figcaption className="telemetry mt-3 flex justify-between">
            <span>{site.owner}</span>
            <span>{t.about.places}</span>
          </figcaption>
        </figure>
        <div className="flex max-w-[60ch] flex-col gap-4 text-text/80 md:col-span-6 md:col-start-3" data-reveal>
          {t.about.body.slice(0, 2).map((p, i) => (
            <p key={i}>{fmt(p, { years })}</p>
          ))}
          <Link href={localePath(locale, "/about")} className="group mt-2 inline-flex items-center gap-2 self-start border-b border-line-strong pb-1 text-text hover:border-text">
            {t.about.more}
            <ArrowEnd className="size-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------- Services --------------------------------------------- */

/** Numbered index of the six categories, each linking to its page */
export function Services({
  t,
  locale,
  num,
  label,
  exclude,
  headingId = "services-title",
}: {
  t: Dictionary;
  locale: Locale;
  num: string;
  label?: string;
  exclude?: CategorySlug;
  headingId?: string;
}) {
  const list = categories.filter((c) => c.slug !== exclude);
  const covers = list.map((c) => categoryCover(c.slug));
  return (
    <section id="services" aria-labelledby={headingId} className={`container-x ${SECTION_PAD}`}>
      <SectionLabel num={num}>
        <span id={headingId}>{label ?? t.services.label}</span>
      </SectionLabel>
      <div className="services mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:gap-8">
        <ol className="border-t border-line lg:col-span-7">
          {list.map((c, i) => {
            const cover = covers[i];
            return (
              <li key={c.slug} data-i={i} className="border-b border-line" data-reveal style={{ ["--d" as string]: i }}>
                <Link href={localePath(locale, `/work/${c.slug}`)} className="group flex items-center gap-4 py-5 sm:gap-6 sm:py-7">
                  <span className="telemetry w-6 shrink-0 !text-[0.75rem]">
                    {String(categories.indexOf(c) + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[clamp(1.4rem,3vw,2.4rem)] font-light leading-tight transition-colors group-hover:text-white">
                      {c.title[locale]}
                    </span>
                    <span className="mt-1 block text-[0.875rem] text-muted">{c.blurb[locale]}</span>
                  </span>
                  <span className="telemetry hidden shrink-0 sm:block">{fmt(t.services.works, { n: c.count })}</span>
                  <span className="media-frame size-14 shrink-0 lg:hidden" style={{ ["--ph-color" as string]: cover.color }}>
                    <Picture img={cover.img} sizes="56px" alt="" />
                  </span>
                  <ArrowEnd className="hidden size-5 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-text rtl:-scale-x-100 rtl:group-hover:-translate-x-1 lg:block" />
                  <span className="sr-only sm:hidden"> ({fmt(t.services.works, { n: c.count })})</span>
                </Link>
              </li>
            );
          })}
        </ol>
        <div className="services-preview relative hidden aspect-[4/5] lg:col-span-4 lg:col-start-9 lg:block" aria-hidden>
          {covers.map((cover, i) => (
            <div
              key={cover.id}
              data-i={i}
              {...(i === 0 ? { "data-default": "" } : {})}
              className="media-frame absolute inset-0"
              style={{ ["--ph-color" as string]: cover.color, ["--ph-blur" as string]: `url("${cover.blur}")` }}
            >
              <Picture img={cover.img} sizes="34vw" alt="" />
              <span className="viewfinder" style={{ ["--vf-inset" as string]: "12px" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------- Process ---------------------------------------------- */

export function Process({ t, num }: { t: Dictionary; num: string }) {
  return (
    <section id="process" aria-labelledby="process-title" className={`container-x ${SECTION_PAD}`}>
      <SectionLabel num={num}>
        <span id="process-title">{t.process.label}</span>
      </SectionLabel>
      <ol className="mt-10 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
        {t.process.steps.map((s, i) => (
          <li key={i} className="flex flex-col gap-4 bg-bg p-6 sm:p-8" data-reveal style={{ ["--d" as string]: i }}>
            <span className="telemetry !text-[0.75rem] !text-accent">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="text-[1.375rem] font-light leading-snug">{s.t}</h3>
            <p className="text-[0.9375rem] leading-relaxed text-text/70">{s.d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ----------------------------------------------- FAQ ----------------------------------------------- */

export function Faq({ t, num }: { t: Dictionary; num: string }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className={`container-x ${SECTION_PAD}`}>
      <SectionLabel num={num}>
        <span id="faq-title">{t.faq.label}</span>
      </SectionLabel>
      <div className="faq mt-10 border-t border-line md:mt-14 lg:ms-[calc(100%/12*3)]">
        {t.faq.items.map((f, i) => (
          <details key={i} className="group border-b border-line" data-reveal style={{ ["--d" as string]: i }}>
            <summary className="flex items-start gap-4 py-5 sm:gap-6 sm:py-6">
              <span className="telemetry w-6 shrink-0 pt-1.5 !text-[0.75rem]">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1 text-[clamp(1.1rem,2vw,1.5rem)] font-light leading-snug">{f.q}</span>
              <Plus className="faq-icon mt-0.5 size-6 shrink-0 text-muted group-hover:text-text" />
            </summary>
            <p className="max-w-[60ch] pb-6 ps-10 text-text/75 sm:ps-12">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------------------- Contact --------------------------------------------- */

export function ContactChannels({ t }: { t: Dictionary }) {
  const rows = [
    { label: t.contact.whatsapp, value: site.phoneDisplay, href: site.whatsapp, icon: WhatsApp },
    { label: t.contact.email, value: site.email, href: `mailto:${site.email}`, icon: Mail },
    { label: t.contact.instagram, value: "@omerhelled", href: site.instagram, icon: Instagram },
    { label: t.contact.linkedin, value: "in/omerhelled", href: site.linkedin, icon: LinkedIn },
  ];
  return (
    <ul className="border-t border-line">
      {rows.map((r, i) => (
        <li key={r.label} className="border-b border-line" data-reveal style={{ ["--d" as string]: i }}>
          <a
            href={r.href}
            className="group flex items-center gap-4 py-5 sm:py-6"
            {...(r.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
          >
            <r.icon className="size-6 shrink-0 text-muted group-hover:text-accent" />
            <span className="w-24 shrink-0 text-muted sm:w-28">{r.label}</span>
            <bdi className="min-w-0 flex-1 truncate text-[clamp(1rem,1.8vw,1.25rem)]" dir="ltr">
              {r.value}
            </bdi>
            <ArrowUpRight className="size-5 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:text-text rtl:-scale-x-100" />
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Closing call-to-action used at the bottom of most pages */
export function ContactCta({ t, locale, num }: { t: Dictionary; locale: Locale; num?: string }) {
  return (
    <section id="contact" aria-labelledby="contact-title" className={`container-x ${SECTION_PAD} pb-[clamp(88px,10vw,144px)]`}>
      {num && <SectionLabel num={num}>{t.contact.label}</SectionLabel>}
      <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5" data-reveal>
          <h2 id="contact-title" className="text-[clamp(2.2rem,5.4vw,4.75rem)] font-light leading-[1.02] tracking-[-0.01em]">
            {t.contact.title}
          </h2>
          <p className="mt-5 max-w-[36ch] text-text/75">{t.contact.sub}</p>
          <Link
            href={localePath(locale, "/contact")}
            className="mt-8 inline-flex h-12 items-center bg-text px-6 font-medium text-bg transition-colors hover:bg-white"
          >
            {t.contact.toForm}
          </Link>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <ContactChannels t={t} />
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------- Footer ---------------------------------------------- */

export async function Footer({ t, locale, nav }: { t: Dictionary; locale: Locale; nav: { href: string; label: string }[] }) {
  const year = await currentYear();
  const L = (p: string) => localePath(locale, p);
  return (
    <footer className="border-t border-line">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-12 md:py-20">
        <div className="sm:col-span-2 md:col-span-4">
          <LogoMark className="h-12 w-auto" />
          <p className="mt-5 text-[0.9375rem] text-muted">
            DronISO · {t.footer.tagline}
            <br />
            {site.owner}
          </p>
        </div>
        <nav aria-label="Footer" className="md:col-span-2 md:col-start-6">
          <ul className="flex flex-col gap-2 text-[0.9375rem]">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-text/75 hover:text-text">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="flex flex-col gap-2 text-[0.9375rem] md:col-span-3">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link href={L(`/work/${c.slug}`)} className="text-text/75 hover:text-text">
                {c.title[locale]}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="flex flex-col gap-2 text-[0.9375rem] md:col-span-2">
          <li>
            <a href={site.whatsapp} className="text-text/75 hover:text-text">
              <bdi dir="ltr">{site.phoneDisplay}</bdi>
            </a>
          </li>
          <li>
            <a href={`mailto:${site.email}`} className="break-all text-text/75 hover:text-text">
              {site.email}
            </a>
          </li>
          <li>
            <a href={site.instagram} className="text-text/75 hover:text-text">
              Instagram
            </a>
          </li>
          <li>
            <a href={site.linkedin} className="text-text/75 hover:text-text">
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
      <div className="container-x flex flex-col gap-3 border-t border-line py-6 text-[0.8125rem] text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          <bdi dir="ltr">© {year} DRONISO</bdi> · {t.footer.rights}
        </p>
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <li>
            <Link href={L("/accessibility")} className="hover:text-text">
              {t.nav.accessibility}
            </Link>
          </li>
          <li>
            <Link href={L("/privacy")} className="hover:text-text">
              {t.nav.privacy}
            </Link>
          </li>
          <li>
            <a href="#top" className="hover:text-text">
              ↑ {t.footer.top}
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
