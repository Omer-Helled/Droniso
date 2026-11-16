import { HomeView, homeMetadata } from "@/views/home";

export const metadata = homeMetadata("he");

export default function Page() {
  return <HomeView locale="he" />;
}
