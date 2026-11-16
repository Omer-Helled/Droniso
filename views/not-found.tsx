import Link from "next/link";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";
import { Chrome } from "@/components/Chrome";

/** Shown when a page calls notFound() (e.g. an unknown category): localized, inside the site frame */
export function NotFoundView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <Chrome locale={locale} path="/404">
      <section className="container-x flex min-h-[80svh] flex-col justify-center pb-20 pt-[calc(var(--header-h)+48px)]">
        <p className="telemetry !text-[0.75rem]">ERR 404 · NO SIGNAL</p>
        <h1 className="mt-6 text-[clamp(2.6rem,8vw,7rem)] font-light leading-none">{t.notFound.title}</h1>
        <p className="mt-6 max-w-[44ch] text-lg text-text/75">{t.notFound.body}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={localePath(locale, "/")} className="inline-flex h-12 items-center bg-text px-6 font-medium text-bg hover:bg-white">
            {t.notFound.home}
          </Link>
          <Link href={localePath(locale, "/work")} className="inline-flex h-12 items-center border border-line-strong px-6 hover:border-text">
            {t.notFound.work}
          </Link>
        </div>
      </section>
    </Chrome>
  );
}
