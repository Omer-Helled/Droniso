import { accessibility } from "@/content/legal";
import { resolveLocale } from "@/lib/route";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/LegalPage";

export async function generateMetadata({ params }: PageProps<"/[lang]/accessibility">) {
  const locale = await resolveLocale(params);
  const doc = accessibility[locale];
  return pageMetadata({ locale, path: "/accessibility", title: doc.title, description: doc.description });
}

export default async function Page({ params }: PageProps<"/[lang]/accessibility">) {
  const locale = await resolveLocale(params);
  return <LegalPage locale={locale} path="/accessibility" doc={accessibility[locale]} />;
}
