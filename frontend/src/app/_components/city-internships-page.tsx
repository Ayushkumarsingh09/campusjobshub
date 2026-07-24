import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { AdSlot } from '@/components/ads/ad-slot';
import { InternshipsListingClient } from '@/app/_components/internships-listing-client';

const CITY_SLUGS = ['mumbai', 'delhi', 'bangalore', 'hyderabad', 'chennai', 'pune', 'kolkata', 'noida', 'gurgaon'];

export function cityInternshipStaticParams() {
  return CITY_SLUGS.map((city) => ({ slug: `in-${city}` }));
}

export function formatCityName(slug: string): string {
  const city = slug.replace(/^in-/, '');
  return city
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function isCityInternshipSlug(slug: string) {
  return slug.startsWith('in-');
}

export function buildCityInternshipMetadata(slug: string) {
  const cityName = formatCityName(slug);
  return buildMetadata({
    title: `Internships in ${cityName} — ${siteConfig.name}`,
    description: `Find internships in ${cityName} for college students. Paid, unpaid, and PPO programs updated daily.`,
    path: `/internships/${slug}`,
  });
}

export function CityInternshipsPage({ slug }: { slug: string }) {
  const cityName = formatCityName(slug);

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageHeader
        title={`Internships in ${cityName}`}
        description={`Student internships and training programs in ${cityName}.`}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: 'Internships', href: '/internships' },
              { name: cityName, href: `/internships/${slug}` },
            ]}
          />
        }
      />

      <AdSlot slotId={`internships-city-${slug}`} format="banner" className="my-8" adEligible />

      <div className="mt-8">
        <InternshipsListingClient
          basePath={`/internships/${slug}`}
          fixedParams={{ city: cityName }}
          initialFilters={{ cities: [cityName] }}
        />
      </div>
    </div>
  );
}
