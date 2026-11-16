import { WorkView, workMetadata } from "@/views/work";

export const metadata = workMetadata("he");

export default function Page() {
  return <WorkView locale="he" />;
}
