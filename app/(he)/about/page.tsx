import { AboutView, aboutMetadata } from "@/views/about";

export const metadata = aboutMetadata("he");

export default function Page() {
  return <AboutView locale="he" />;
}
