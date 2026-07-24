import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { AdSlot } from '@/components/ads/ad-slot';
import { JobsListingClient } from '@/app/_components/jobs-listing-client';

export const metadata = buildMetadata({
  title: `Remote Jobs for Freshers in India — ${siteConfig.name}`,
  description:
    'Browse work-from-home and fully remote job openings for fresh graduates and early-career professionals in India.',
  path: '/jobs/remote',
});

export default function RemoteJobsPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageHeader
        title="Remote Jobs"
        description="Work-from-anywhere opportunities for campus hires and freshers across India."
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: 'Jobs', href: '/jobs' },
              { name: 'Remote', href: '/jobs/remote' },
            ]}
          />
        }
      />

      <p className="mt-6 max-w-3xl text-muted-foreground">
        Remote and hybrid roles are increasingly common in software, design, marketing, and customer
        support. All listings on this page are marked as remote-friendly by employers.
      </p>

      <AdSlot slotId="jobs-remote-top" format="banner" className="my-8" adEligible />

      <div className="mt-8">
        <JobsListingClient
          basePath="/jobs/remote"
          fixedParams={{ remote: true }}
          initialFilters={{ remote: true }}
        />
      </div>
    </div>
  );
}
