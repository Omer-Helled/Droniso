import { privacy } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/LegalPage";

const doc = privacy.he;

export const metadata = pageMetadata({ locale: "he", path: "/privacy", title: doc.title, description: doc.description });

export default function Page() {
  return <LegalPage locale="he" path="/privacy" doc={doc} />;
}
