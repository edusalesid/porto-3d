import { redirect } from 'next/navigation';

export default async function ProjectSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/?case=${slug}`);
}
