import { CategoryView, categoryMetadata, categoryParams } from "@/views/category";

type Props = PageProps<"/work/[category]">;

export function generateStaticParams() {
  return categoryParams();
}

export async function generateMetadata({ params }: Props) {
  return categoryMetadata("he", (await params).category);
}

export default async function Page({ params }: Props) {
  return <CategoryView locale="he" slug={(await params).category} />;
}
