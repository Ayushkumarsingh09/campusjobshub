import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { DashboardOverview } from '@/app/_components/dashboard-overview';

export const metadata = buildMetadata({
  title: `Career Dashboard — ${siteConfig.name}`,
  description: 'Your personal dashboard for job applications, saved listings, ATS scores, and career recommendations.',
  path: '/dashboard',
  noIndex: true,
});

export default function DashboardPage() {
  return <DashboardOverview />;
}
