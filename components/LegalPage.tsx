import { fmt, getDictionary, localePath, type Locale } from "@/lib/i18n";
import type { LegalDoc } from "@/content/legal";
import { UPDATED } from "@/content/legal";
import { Chrome } from "@/components/Chrome";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/Sections";
import { breadcrumbJsonLd } from "@/lib/seo";

export function LegalPage({ locale, path, doc }: { locale: Locale; path: string; doc: LegalDoc }) {
  const t = getDictionary(locale);
  const crumbs = [{ name: doc.title, href: localePath(locale, path) }];
  return (
    <Chrome locale={locale} path={path}>
      <JsonLd data={breadcrumbJsonLd([{ name: t.nav.homeCrumb, href: localePath(locale, "/") }, ...crumbs])} />
      <PageHeader locale={locale} crumbs={crumbs} title={doc.title} intro={doc.intro} />
      <div className="container-x pb-[clamp(88px,10vw,144px)] pt-12 md:pt-16">
        <p className="text-[0.875rem] text-muted">{fmt(t.legal.updated, { date: UPDATED[locale] })}</p>
        <div className="mt-10 flex max-w-[70ch] flex-col gap-12">
          {doc.sections.map((s) => (
            <section key={s.h} className="flex flex-col gap-4">
              <h2 className="text-[1.5rem] font-light">{s.h}</h2>
              {s.p?.map((p, i) => (
                <p key={i} className="leading-relaxed text-text/80">
                  {p}
                </p>
              ))}
              {s.list && (
                <ul className="flex list-disc flex-col gap-2 ps-5 leading-relaxed text-text/80 marker:text-muted">
                  {s.list.map((li, i) => (
                    <li key={i}>{li}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </Chrome>
  );
}
