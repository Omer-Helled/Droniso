import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import "../globals.css";
import { dirOf, getDictionary, isLocale, localePath, locales, site, type Locale } from "@/lib/i18n";
import { RevealObserver } from "@/components/RevealObserver";

export const ensureStatic = "navigation";

const latin = localFont({
  variable: "--font-latin",
  display: "swap",
  src: [
    { path: "../fonts/plex-sans-latin-300.woff2", weight: "300" },
    { path: "../fonts/plex-sans-latin-400.woff2", weight: "400" },
    { path: "../fonts/plex-sans-latin-500.woff2", weight: "500" },
  ],
});

const hebrew = localFont({
  variable: "--font-hebrew",
  display: "swap",
  src: [
    { path: "../fonts/plex-sans-hebrew-300.woff2", weight: "300" },
    { path: "../fonts/plex-sans-hebrew-400.woff2", weight: "400" },
    { path: "../fonts/plex-sans-hebrew-500.woff2", weight: "500" },
  ],
});

const mono = localFont({
  variable: "--font-mono-plex",
  display: "swap",
  preload: false,
  src: [
    { path: "../fonts/plex-mono-400.woff2", weight: "400" },
    { path: "../fonts/plex-mono-500.woff2", weight: "500" },
  ],
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    metadataBase: new URL(site.url),
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: localePath(lang, "/"),
      languages: { he: localePath("he", "/"), en: localePath("en", "/"), "x-default": "/" },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: t.meta.title,
      description: t.meta.description,
      locale: lang === "he" ? "he_IL" : "en_US",
      images: [{ url: "/media/hero/poster-1080.jpg", width: 1920, height: 1080 }],
    },
    icons: {
      icon: [
        { url: "/brand/favicon.svg", type: "image/svg+xml" },
        { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: "/brand/apple-touch-icon.png",
    },
    // Prototype: keep it out of search engines until launch
    robots: { index: false, follow: false },
    verification: {
      google: ["W6gmGe8ExnkpEKpKgwvI3HDQG7NGrjh4hUyclOMh-6Q", "z9W4UYkbwmZiWl11_HXmKH2cxQZ7SCDD9pkl07wKr-U"],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0e0f10",
  colorScheme: "dark",
};

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  return (
    <html
      lang={locale}
      dir={dirOf(locale)}
      className={`${latin.variable} ${hebrew.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
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
