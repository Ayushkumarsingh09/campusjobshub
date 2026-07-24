import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { fetchListWithFallback } from '@/lib/fetch-content';
import { FALLBACK_ROADMAPS } from '@/lib/static-fallback-data';
import type { CareerRoadmap } from '@/types/api';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { RoadmapCard } from '@/components/cards/roadmap-card';
import { AdSlot } from '@/components/ads/ad-slot';

export const metadata = buildMetadata({
  title: `Career Roadmaps for Students — ${siteConfig.name}`,
  description:
    'Structured learning paths for software engineering, data science, product management, and more. Step-by-step placement preparation.',
  path: '/prepare/roadmaps',
});

async function getRoadmaps(): Promise<CareerRoadmap[]> {
  return fetchListWithFallback('/roadmaps', { page: 1, limit: 24 }, FALLBACK_ROADMAPS);
}

export default async function RoadmapsPage() {
  const display = await getRoadmaps();

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageHeader
        title="Career Roadmaps"
        description="Follow structured learning paths designed for Indian students targeting campus placements."
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: 'Prepare', href: '/prepare/roadmaps' },
              { name: 'Roadmaps', href: '/prepare/roadmaps' },
            ]}
          />
        }
      />

      <AdSlot slotId="roadmaps-list-top" format="banner" className="my-8" adEligible />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {display.map((roadmap) => (
          <RoadmapCard
            key={roadmap.id}
            title={roadmap.title}
            slug={roadmap.slug}
            description={roadmap.description}
            level={roadmap.difficulty}
            topic={'topic' in roadmap ? roadmap.topic : undefined}
            thumbnailUrl={'thumbnailUrl' in roadmap ? roadmap.thumbnailUrl : undefined}
            duration={
              roadmap.estimatedHours ? `${roadmap.estimatedHours} hours` : undefined
            }
            topicsCount={roadmap.steps?.length}
          />
        ))}
      </div>
    </div>
  );
}
