import { CategoryView, categoryMetadata, categoryParams } from "@/views/category";

type Props = PageProps<"/en/work/[category]">;

export function generateStaticParams() {
  return categoryParams();
}

export async function generateMetadata({ params }: Props) {
  return categoryMetadata("en", (await params).category);
}

export default async function Page({ params }: Props) {
  return <CategoryView locale="en" slug={(await params).category} />;
}
