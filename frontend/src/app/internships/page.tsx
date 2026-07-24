import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { AdSlot } from '@/components/ads/ad-slot';
import { InternshipsListingClient } from '@/app/_components/internships-listing-client';
import { fetchListWithFallback } from '@/lib/fetch-content';
import { FALLBACK_INTERNSHIPS } from '@/lib/static-fallback-data';
import type { Internship } from '@/types/api';

export const metadata = buildMetadata({
  title: `Internships in India — ${siteConfig.name}`,
  description:
    'Find paid and unpaid internships for college students across India. Summer, winter, and year-round programs with PPO opportunities.',
  path: '/internships',
});

export default async function InternshipsPage() {
  const initialInternships = await fetchListWithFallback<Internship>(
    '/internships',
    { page: 1, limit: 12 },
    FALLBACK_INTERNSHIPS
  );

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageHeader
        title="Internships"
        description="Discover internships from startups, MNCs, and campus recruiters across India."
        breadcrumbs={
          <Breadcrumbs items={[{ name: 'Internships', href: '/internships' }]} />
        }
      />

      <AdSlot slotId="internships-list-top" format="banner" className="my-8" adEligible />

      <div className="mt-8">
        <InternshipsListingClient basePath="/internships" initialInternships={initialInternships} />
      </div>
    </div>
  );
}
