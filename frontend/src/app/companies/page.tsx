import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { AdSlot } from '@/components/ads/ad-slot';
import { CompaniesListingClient } from '@/app/_components/companies-listing-client';
import { fetchListWithFallback } from '@/lib/fetch-content';
import { FALLBACK_COMPANIES } from '@/lib/static-fallback-data';
import type { Company } from '@/types/api';

export const metadata = buildMetadata({
  title: `Companies Hiring Campus Freshers — ${siteConfig.name}`,
  description:
    'Explore verified companies hiring students and fresh graduates in India. View open jobs and internships by employer.',
  path: '/companies',
});

export default async function CompaniesPage() {
  const initialCompanies = await fetchListWithFallback<Company>(
    '/companies',
    { page: 1, limit: 12 },
    FALLBACK_COMPANIES.slice(0, 12)
  );

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageHeader
        title="Companies"
        description="Browse employers actively hiring campus talent and fresh graduates across India."
        breadcrumbs={
          <Breadcrumbs items={[{ name: 'Companies', href: '/companies' }]} />
        }
      />

      <AdSlot slotId="companies-list-top" format="banner" className="my-8" adEligible />

      <div className="mt-8">
        <CompaniesListingClient initialCompanies={initialCompanies} />
      </div>
    </div>
  );
}
