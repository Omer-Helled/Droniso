import type { ReactNode } from "react";
import { fontVariables } from "./fonts";
import { dirOf, type Locale } from "@/lib/i18n";
import { RevealObserver } from "@/components/RevealObserver";

const INLINE_SCRIPT = `(function(h){h.classList.add("js");
addEventListener("pointerdown",function(){h.setAttribute("data-input","pointer")},true);
addEventListener("keydown",function(e){if(!e.metaKey&&!e.ctrlKey&&!e.altKey)h.setAttribute("data-input","keyboard")},true)})(document.documentElement)`;

/** The <html> document shared by the Hebrew and English root layouts */
export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    // data-scroll-behavior tells Next.js to switch smooth scrolling off while it resets the scroll
    // position on navigation, so a new page opens at its top instead of gliding there
    <html lang={locale} dir={dirOf(locale)} className={fontVariables} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* "js" class for progressive enhancement, and the last input type (pointer or keyboard) for focus rings in globals.css */}
        <script dangerouslySetInnerHTML={{ __html: INLINE_SCRIPT }} />
      </head>
      <body>
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
