import { accessibility } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/LegalPage";

const doc = accessibility.he;

export const metadata = pageMetadata({ locale: "he", path: "/accessibility", title: doc.title, description: doc.description });

export default function Page() {
  return <LegalPage locale="he" path="/accessibility" doc={doc} />;
}
