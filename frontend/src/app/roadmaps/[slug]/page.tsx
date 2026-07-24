import { redirect } from 'next/navigation';

interface RoadmapSlugRedirectProps {
  params: Promise<{ slug: string }>;
}

export default async function RoadmapSlugRedirectPage({ params }: RoadmapSlugRedirectProps) {
  const { slug } = await params;
  redirect(`/prepare/roadmaps/${slug}`);
}
