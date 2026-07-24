import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { AdSlot } from '@/components/ads/ad-slot';
import { JobsListingClient } from '@/app/_components/jobs-listing-client';

const CITY_SLUGS = ['mumbai', 'delhi', 'bangalore', 'hyderabad', 'chennai', 'pune', 'kolkata', 'noida', 'gurgaon'];

export function cityJobStaticParams() {
  return CITY_SLUGS.map((city) => ({ slug: `in-${city}` }));
}

export function formatCityName(slug: string): string {
  const city = slug.replace(/^in-/, '');
  return city
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function isCityJobSlug(slug: string) {
  return slug.startsWith('in-');
}

export function buildCityJobMetadata(slug: string) {
  const cityName = formatCityName(slug);
  return buildMetadata({
    title: `Jobs in ${cityName} — Campus & Fresher Openings — ${siteConfig.name}`,
    description: `Find campus jobs and fresher openings in ${cityName}. Updated daily with IT, startup, and corporate roles.`,
    path: `/jobs/${slug}`,
  });
}

export function CityJobsPage({ slug }: { slug: string }) {
  const cityName = formatCityName(slug);

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageHeader
        title={`Jobs in ${cityName}`}
        description={`Latest campus and fresher job openings in ${cityName} and nearby areas.`}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: 'Jobs', href: '/jobs' },
              { name: cityName, href: `/jobs/${slug}` },
            ]}
          />
        }
      />

      <p className="mt-6 max-w-3xl text-muted-foreground">
        Explore opportunities from leading employers hiring in {cityName}. Use filters to narrow by
        experience level, salary, and work mode.
      </p>

      <AdSlot slotId={`jobs-city-${slug}`} format="banner" className="my-8" adEligible />

      <div className="mt-8">
        <JobsListingClient
          basePath={`/jobs/${slug}`}
          fixedParams={{ city: cityName }}
          initialFilters={{ cities: [cityName] }}
        />
      </div>
    </div>
  );
}
