import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { AdSlot } from '@/components/ads/ad-slot';
import { JobsListingClient } from '@/app/_components/jobs-listing-client';

export const metadata = buildMetadata({
  title: `Campus & Fresher Jobs in India — ${siteConfig.name}`,
  description:
    'Browse latest campus jobs and fresher openings across India. Filter by city, remote work, and experience level.',
  path: '/jobs',
});

export default function JobsPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageHeader
        title="Campus & Fresher Jobs"
        description="Discover the latest job openings for fresh graduates and campus hires across India."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Jobs', href: '/jobs' }]} />}
      />

      <AdSlot slotId="jobs-list-top" format="banner" className="my-8" adEligible />

      <div className="mt-8">
        <JobsListingClient basePath="/jobs" />
      </div>
    </div>
  );
}
