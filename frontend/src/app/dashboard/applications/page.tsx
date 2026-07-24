import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { ApplicationTracker } from '@/components/career/application-tracker';

export const metadata = buildMetadata({
  title: `Application Tracker — ${siteConfig.name}`,
  description: 'Track campus job applications with kanban board, timeline, and analytics.',
  path: '/dashboard/applications',
  noIndex: true,
});

export default function ApplicationsPage() {
  return <ApplicationTracker />;
}
