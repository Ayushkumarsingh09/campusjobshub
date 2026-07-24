import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { SavedJobsList } from '@/components/career/saved-jobs-list';

export const metadata = buildMetadata({
  title: `Saved Jobs — ${siteConfig.name}`,
  path: '/dashboard/saved-jobs',
  noIndex: true,
  description: 'Your bookmarked campus jobs and internships.',
});

export default function SavedJobsPage() {
  return <SavedJobsList />;
}
