import type { ReactNode } from "react";
import { getDictionary, localePath, site, type Locale } from "@/lib/i18n";
import { categories } from "@/lib/portfolio";
import { Header, type NavItem } from "@/components/Header";
import { Footer } from "@/components/Sections";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

/** Shared page frame: skip link, header, main, footer and the floating WhatsApp button.
 *  Each page passes its own logical path (e.g. "/work") so the language switch and the active
 *  menu item are rendered statically, without reading the URL on the client. */
export function Chrome({
  locale,
  path,
  overHero = false,
  children,
}: {
  locale: Locale;
  path: string;
  overHero?: boolean;
  children: ReactNode;
}) {
  const t = getDictionary(locale);
  const other: Locale = locale === "he" ? "en" : "he";
  const L = (p: string) => localePath(locale, p);
  const home = L("/");

  const nav: NavItem[] = [
    {
      href: L("/work"),
      label: t.nav.work,
      children: [{ href: L("/work"), label: t.nav.allWork }, ...categories.map((c) => ({ href: L(`/work/${c.slug}`), label: c.title[locale] }))],
    },
    { href: L("/about"), label: t.nav.about },
    { href: home === "/" ? "/#faq" : `${home}#faq`, label: t.nav.faq },
  ];
  const contact = { href: L("/contact"), label: t.nav.contact };

  return (
    <>
      <a href="#main" className="sr-only z-50 bg-text px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:start-4 focus:top-4">
        {t.skip}
      </a>
      <span id="top" />
      <Header
        homeHref={home}
        homeLabel={t.nav.home}
        nav={nav}
        contact={contact}
        current={path}
        overHero={overHero}
        langSwitch={{ href: localePath(other, path), label: t.nav.switchTo, short: t.nav.switchToShort, hrefLang: other }}
        menuLabel={t.nav.menu}
        closeLabel={t.nav.close}
        socials={{ whatsapp: site.whatsapp, email: site.email, instagram: site.instagram, linkedin: site.linkedin }}
      />
      <main id="main">{children}</main>
      <Footer t={t} locale={locale} nav={[...nav.map(({ href, label }) => ({ href, label })), contact]} />
      <aside aria-label={t.contact.whatsapp}>
        <WhatsAppFloat href={site.whatsapp} label={t.contact.whatsappFloat} delayed={overHero} />
      </aside>
    </>
  );
}
