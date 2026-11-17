import type { ReactNode } from "react";
import { fontVariables } from "./fonts";
import { dirOf, type Locale } from "@/lib/i18n";
import { RevealObserver } from "@/components/RevealObserver";

/** The <html> document shared by the Hebrew and English root layouts */
export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    // data-scroll-behavior tells Next.js to switch smooth scrolling off while it resets the scroll
    // position on navigation, so a new page opens at its top instead of gliding there
    <html lang={locale} dir={dirOf(locale)} className={fontVariables} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
