import { privacy } from "@/content/legal";
import { resolveLocale } from "@/lib/route";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/LegalPage";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">) {
  const locale = await resolveLocale(params);
  const doc = privacy[locale];
  return pageMetadata({ locale, path: "/privacy", title: doc.title, description: doc.description });
}

export default async function Page({ params }: PageProps<"/[lang]/privacy">) {
  const locale = await resolveLocale(params);
  return <LegalPage locale={locale} path="/privacy" doc={privacy[locale]} />;
}
