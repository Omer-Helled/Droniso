import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { fontVariables } from "./fonts";
import { getDictionary } from "@/lib/i18n";
import { LogoMark } from "@/components/brand/Logo";

// Any URL that matches no route at all. Bilingual, since the language can't be known here.

export const metadata: Metadata = {
  title: "404 · DronISO",
  robots: { index: false },
};

export default function GlobalNotFound() {
  const he = getDictionary("he");
  const en = getDictionary("en");
  return (
    <html lang="he" dir="rtl" className={fontVariables}>
      <body>
        <main className="container-x flex min-h-svh flex-col justify-center gap-14 py-16">
          <Link href="/" aria-label="DronISO">
            <LogoMark className="h-12 w-auto" />
          </Link>
          <p className="telemetry !text-[0.75rem]">ERR 404 · NO SIGNAL</p>
          <div className="grid gap-12 md:grid-cols-2">
            <section>
              <h1 className="text-[clamp(2.4rem,6vw,5rem)] font-light leading-none">{he.notFound.title}</h1>
              <p className="mt-5 max-w-[40ch] text-text/75">{he.notFound.body}</p>
              <Link href="/" className="mt-8 inline-flex h-12 items-center bg-text px-6 font-medium text-bg">
                {he.notFound.home}
              </Link>
            </section>
            <section lang="en" dir="ltr">
              <h2 className="text-[clamp(2.4rem,6vw,5rem)] font-light leading-none">{en.notFound.title}</h2>
              <p className="mt-5 max-w-[40ch] text-text/75">{en.notFound.body}</p>
              <Link href="/en" className="mt-8 inline-flex h-12 items-center border border-line-strong px-6">
                {en.notFound.home}
              </Link>
            </section>
          </div>
        </main>
      </body>
    </html>
  );
}
