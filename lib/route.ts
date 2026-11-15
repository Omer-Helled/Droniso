import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";

/** Read and validate the [lang] segment */
export async function resolveLocale(params: Promise<{ lang: string }>): Promise<Locale> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return lang;
}
