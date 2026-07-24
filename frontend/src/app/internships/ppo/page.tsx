import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { AdSlot } from '@/components/ads/ad-slot';
import { InternshipsListingClient } from '@/app/_components/internships-listing-client';

export const metadata = buildMetadata({
  title: `PPO Internships — Pre-Placement Offer Roles — ${siteConfig.name}`,
  description:
    'Internships with pre-placement offer (PPO) potential. Convert your internship into a full-time job after graduation.',
  path: '/internships/ppo',
});

export default function PpoInternshipsPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageHeader
        title="PPO Internships"
        description="Internships that may lead to a pre-placement offer (PPO) for full-time roles."
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: 'Internships', href: '/internships' },
              { name: 'PPO', href: '/internships/ppo' },
            ]}
          />
        }
      />

      <p className="mt-6 max-w-3xl text-muted-foreground">
        A Pre-Placement Offer (PPO) is a full-time job offer extended during or after a successful
        internship, typically before final-year campus placements. These roles are highly competitive
        — prepare thoroughly and treat the internship as an extended interview.
      </p>

      <AdSlot slotId="internships-ppo-top" format="banner" className="my-8" adEligible />

      <div className="mt-8">
        <InternshipsListingClient
          basePath="/internships/ppo"
          fixedParams={{ ppo: true }}
        />
      </div>
    </div>
  );
}
