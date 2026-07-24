import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { RecommendationsPanel } from '@/components/career/recommendations-panel';

export const metadata = buildMetadata({
  title: `Recommendations — ${siteConfig.name}`,
  path: '/dashboard/recommendations',
  noIndex: true,
  description: 'Personalized job and career recommendations.',
});

export default function RecommendationsPage() {
  return <RecommendationsPanel />;
}
