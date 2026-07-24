import { Suspense } from 'react';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { Skeleton } from '@/components/ui/skeleton';
import { SearchResultsClient } from '@/app/_components/search-results-client';

export const metadata = buildMetadata({
  title: `Search — ${siteConfig.name}`,
  description: 'Search jobs, internships, companies, and placement articles on CampusJobsHub.',
  path: '/search',
  noIndex: true,
});

function SearchFallback() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-5 w-48" />
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full" />
      ))}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageHeader
        title="Search"
        description="Find jobs, internships, companies, and career articles."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Search', href: '/search' }]} />}
      />
      <div className="mt-8">
        <Suspense fallback={<SearchFallback />}>
          <SearchResultsClient />
        </Suspense>
      </div>
    </div>
  );
}
