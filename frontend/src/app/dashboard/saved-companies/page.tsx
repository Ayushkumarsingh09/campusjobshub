import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { SavedCompaniesList } from '@/components/career/saved-companies-list';

export const metadata = buildMetadata({
  title: `Saved Companies — ${siteConfig.name}`,
  path: '/dashboard/saved-companies',
  noIndex: true,
  description: 'Companies you follow for campus hiring alerts.',
});

export default function SavedCompaniesPage() {
  return <SavedCompaniesList />;
}
