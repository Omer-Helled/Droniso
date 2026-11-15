import type { ReactNode } from "react";
import { fmt, site, type Dictionary, type Locale } from "@/lib/i18n";
import { categories, imageSrcSet, items, wixImage, type CategorySlug } from "@/lib/portfolio";
import { ArrowEnd, ArrowUpRight, Instagram, LinkedIn, Mail, Plus, WhatsApp } from "@/components/Icons";
import { LogoMark } from "@/components/brand/Logo";

export function SectionLabel({ num, children }: { num: string; children: ReactNode }) {
  return (
    <p className="section-label" data-reveal>
      <span className="num">{num}</span>
      <span>{children}</span>
    </p>
  );
}

/* ----------------------------------------------- About ----------------------------------------------- */

export function About({ t, num }: { t: Dictionary; num: string }) {
  const photo = "https://static.wixstatic.com/media/fdb09b_8cada923565e41c6a3a362e557e1a59d~mv2.jpg";
  return (
    <section id="about" aria-labelledby="about-title" className="container-x pt-[clamp(88px,10vw,144px)]">
      <SectionLabel num={num}>{t.about.label}</SectionLabel>
      <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12 md:gap-8">
        <h2 id="about-title" className="text-[clamp(1.6rem,3.4vw,3.1rem)] font-light leading-[1.18] md:col-span-8" data-reveal>
          {t.about.lead}
        </h2>
        <figure className="md:col-span-4 md:col-start-9 md:row-span-2 md:row-start-1" data-reveal style={{ ["--d" as string]: 1 }}>
          <div className="media-frame aspect-[4/5]" style={{ ["--ph-color" as string]: "#6d7e9d" }}>
            <img
              src={wixImage(photo, 900)}
              srcSet={[480, 700, 900, 1300].map((w) => `${wixImage(photo, w)} ${w}w`).join(", ")}
              sizes="(min-width: 768px) 30vw, 100vw"
              alt={t.about.photoAlt}
              loading="lazy"
              className="!object-[42%_50%]"
            />
            <span className="viewfinder" aria-hidden style={{ ["--vf-inset" as string]: "12px" }} />
          </div>
          <figcaption className="telemetry mt-3 flex justify-between">
            <span>{site.owner}</span>
            <span>{t.about.places}</span>
          </figcaption>
        </figure>
        <div className="flex max-w-[60ch] flex-col gap-4 text-text/80 md:col-span-6 md:col-start-3" data-reveal>
          {t.about.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------- Services --------------------------------------------- */

const COVERS: Record<CategorySlug, [string, number]> = {
  landscapes: ["landscapes", 2],
  "real-estate": ["real-estate", 15],
  hotels: ["hotels", 2],
  extreme: ["extreme", 2],
  commercials: ["commercials", 2],
  "weddings-events": ["weddings-events", 4],
};

export function Services({ t, locale, num }: { t: Dictionary; locale: Locale; num: string }) {
  const covers = categories.map((c) => {
    const [cat, order] = COVERS[c.slug];
    return items.find((i) => i.category === cat && i.order === order)!;
  });
  return (
    <section id="services" aria-labelledby="services-title" className="container-x pt-[clamp(88px,10vw,144px)]">
      <SectionLabel num={num}>
        <span id="services-title">{t.services.label}</span>
      </SectionLabel>
      <div className="services mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:gap-8">
        <ol className="border-t border-line lg:col-span-7">
          {categories.map((c, i) => {
            const cover = covers[i];
            return (
              <li key={c.slug} data-i={i} className="border-b border-line" data-reveal style={{ ["--d" as string]: i }}>
                <a href={`#work/${c.slug}`} className="group flex items-center gap-4 py-5 sm:gap-6 sm:py-7">
                  <span className="telemetry w-6 shrink-0 !text-[0.75rem]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[clamp(1.4rem,3vw,2.4rem)] font-light leading-tight transition-colors group-hover:text-white">
                      {c.title[locale]}
                    </span>
                    <span className="mt-1 block text-[0.875rem] text-muted">{c.blurb[locale]}</span>
                  </span>
                  <span className="telemetry hidden shrink-0 sm:block">{fmt(t.services.works, { n: c.count })}</span>
                  <span className="media-frame size-14 shrink-0 lg:hidden" style={{ ["--ph-color" as string]: cover.color }}>
                    <img src={wixImage(cover.type === "video" ? cover.poster! : cover.src, 160)} alt="" loading="lazy" />
                  </span>
                  <ArrowEnd className="hidden size-5 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-text rtl:-scale-x-100 rtl:group-hover:-translate-x-1 lg:block" />
                  <span className="sr-only sm:hidden"> ({fmt(t.services.works, { n: c.count })})</span>
                </a>
              </li>
            );
          })}
        </ol>
        <div className="services-preview relative hidden aspect-[4/5] lg:col-span-4 lg:col-start-9 lg:block" aria-hidden>
          {covers.map((cover, i) => {
            const { srcSet } = imageSrcSet(cover);
            return (
              <div
                key={cover.id}
                data-i={i}
                {...(i === 0 ? { "data-default": "" } : {})}
                className="media-frame absolute inset-0"
                style={{ ["--ph-color" as string]: cover.color, ["--ph-blur" as string]: `url("${cover.blur}")` }}
              >
                <img srcSet={srcSet} sizes="34vw" alt="" loading="lazy" />
                <span className="viewfinder" style={{ ["--vf-inset" as string]: "12px" }} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------- FAQ ----------------------------------------------- */

export function Faq({ t, num }: { t: Dictionary; num: string }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="container-x pt-[clamp(88px,10vw,144px)]">
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

export function Contact({ t, num }: { t: Dictionary; num: string }) {
  const rows = [
    { label: t.contact.whatsapp, value: site.phoneDisplay, href: site.whatsapp, icon: WhatsApp, ltr: true },
    { label: t.contact.email, value: site.email, href: `mailto:${site.email}`, icon: Mail, ltr: true },
    { label: t.contact.instagram, value: "@omerhelled", href: site.instagram, icon: Instagram, ltr: true },
    { label: t.contact.linkedin, value: "in/omerhelled", href: site.linkedin, icon: LinkedIn, ltr: true },
  ];
  return (
    <section id="contact" aria-labelledby="contact-title" className="container-x pt-[clamp(88px,10vw,144px)] pb-[clamp(88px,10vw,144px)]">
      <SectionLabel num={num}>{t.contact.label}</SectionLabel>
      <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5" data-reveal>
          <h2 id="contact-title" className="text-[clamp(2.2rem,5.4vw,4.75rem)] font-light leading-[1.02] tracking-[-0.01em]">
            {t.contact.title}
          </h2>
          <p className="mt-5 max-w-[36ch] text-text/75">{t.contact.sub}</p>
        </div>
        <ul className="border-t border-line lg:col-span-6 lg:col-start-7">
          {rows.map((r, i) => (
            <li key={r.label} className="border-b border-line" data-reveal style={{ ["--d" as string]: i }}>
              <a href={r.href} className="group flex items-center gap-4 py-5 sm:py-6" {...(r.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}>
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
      </div>
    </section>
  );
}

/* ---------------------------------------------- Footer ---------------------------------------------- */

async function currentYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function Footer({ t, nav }: { t: Dictionary; nav: { href: string; label: string }[] }) {
  const year = await currentYear();
  return (
    <footer className="border-t border-line">
      <div className="container-x grid gap-10 py-14 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <LogoMark className="h-12 w-auto" />
          <p className="mt-5 text-[0.9375rem] text-muted">
            DronISO · {t.footer.tagline}
            <br />
            {site.owner}
          </p>
        </div>
        <nav aria-label="Footer" className="md:col-span-3 md:col-start-7">
          <ul className="flex flex-col gap-2 text-[0.9375rem]">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="text-text/75 hover:text-text">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="flex flex-col gap-2 text-[0.9375rem] md:col-span-3">
          <li>
            <a href={site.whatsapp} className="text-text/75 hover:text-text">
              <bdi dir="ltr">{site.phoneDisplay}</bdi>
            </a>
          </li>
          <li>
            <a href={`mailto:${site.email}`} className="text-text/75 hover:text-text">
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
      <div className="container-x flex flex-col gap-2 border-t border-line py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.8125rem] text-muted">
          <bdi dir="ltr">© {year} DRONISO</bdi> · {t.footer.rights}
        </p>
        <a href="#top" className="telemetry hover:!text-text">
          ↑ {t.footer.top}
        </a>
      </div>
    </footer>
  );
}
