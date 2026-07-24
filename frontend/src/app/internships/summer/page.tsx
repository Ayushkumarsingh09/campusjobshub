import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { AdSlot } from '@/components/ads/ad-slot';
import { InternshipsListingClient } from '@/app/_components/internships-listing-client';

export const metadata = buildMetadata({
  title: `Summer Internships 2026 in India — ${siteConfig.name}`,
  description:
    'Find summer internship programs for engineering, MBA, and undergraduate students. Paid roles with learning and PPO potential.',
  path: '/internships/summer',
});

export default function SummerInternshipsPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageHeader
        title="Summer Internships"
        description="Summer 2026 internship programs from top companies hiring students across India."
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: 'Internships', href: '/internships' },
              { name: 'Summer', href: '/internships/summer' },
            ]}
          />
        }
      />

      <p className="mt-6 max-w-3xl text-muted-foreground">
        Summer internships typically run 8–12 weeks between May and July. Apply early — many
        programs close applications by March. Look for stipend details, project scope, and PPO
        conversion rates when comparing offers.
      </p>

      <AdSlot slotId="internships-summer-top" format="banner" className="my-8" adEligible />

      <div className="mt-8">
        <InternshipsListingClient
          basePath="/internships/summer"
          fixedParams={{ search: 'summer' }}
        />
      </div>
    </div>
  );
}
