import { privacy } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/LegalPage";

const doc = privacy.en;

export const metadata = pageMetadata({ locale: "en", path: "/privacy", title: doc.title, description: doc.description });

export default function Page() {
  return <LegalPage locale="en" path="/privacy" doc={doc} />;
}
