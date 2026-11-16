import type { ReactNode } from "react";
import { fontVariables } from "./fonts";
import { dirOf, type Locale } from "@/lib/i18n";
import { RevealObserver } from "@/components/RevealObserver";

/** The <html> document shared by the Hebrew and English root layouts */
export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={locale} dir={dirOf(locale)} className={fontVariables} suppressHydrationWarning>
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
