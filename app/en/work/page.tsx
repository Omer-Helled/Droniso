import { WorkView, workMetadata } from "@/views/work";

export const metadata = workMetadata("en");

export default function Page() {
  return <WorkView locale="en" />;
}
