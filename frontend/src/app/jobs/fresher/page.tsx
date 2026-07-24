import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { AdSlot } from '@/components/ads/ad-slot';
import { JobsListingClient } from '@/app/_components/jobs-listing-client';

export const metadata = buildMetadata({
  title: `Fresher Jobs in India (0-1 Year) — ${siteConfig.name}`,
  description:
    'Find fresher jobs for graduates with 0 to 1 year experience. Campus hiring, trainee roles, and entry-level openings across India.',
  path: '/jobs/fresher',
});

export default function FresherJobsPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageHeader
        title="Fresher Jobs"
        description="Entry-level and campus hire positions for fresh graduates with 0–1 year of experience."
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: 'Jobs', href: '/jobs' },
              { name: 'Fresher', href: '/jobs/fresher' },
            ]}
          />
        }
      />

      <p className="mt-6 max-w-3xl text-muted-foreground">
        Whether you have just completed your degree or are in your first year of work, these listings
        are tailored for candidates with minimal professional experience. Filter by city or remote
        work to find roles at IT services, startups, and campus recruiters.
      </p>

      <AdSlot slotId="jobs-fresher-top" format="banner" className="my-8" adEligible />

      <div className="mt-8">
        <JobsListingClient
          basePath="/jobs/fresher"
          fixedParams={{ experienceMin: 0 }}
          initialFilters={{ experience: ['fresher'] }}
        />
      </div>
    </div>
  );
}
