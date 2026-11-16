import { accessibility } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/LegalPage";

const doc = accessibility.en;

export const metadata = pageMetadata({ locale: "en", path: "/accessibility", title: doc.title, description: doc.description });

export default function Page() {
  return <LegalPage locale="en" path="/accessibility" doc={doc} />;
}
