import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { ToolLanding } from '@/components/marketing/tool-landing';

export const metadata = buildMetadata({
  title: `Job Application Tracker for Students — ${siteConfig.name}`,
  description:
    'Track campus job applications with kanban board, timeline view, and analytics. Manage applied, interview, assessment, offer, and rejected statuses.',
  path: '/application-tracker',
});

export default function ApplicationTrackerLandingPage() {
  return (
    <ToolLanding
      title="Application Tracker"
      description="Never lose track of a campus application again. Kanban pipeline, timeline history, notes, and analytics — all in one dashboard."
      path="/application-tracker"
      breadcrumbName="Application Tracker"
      ctaHref="/dashboard/applications"
      ctaLabel="Open my tracker"
      secondaryCta={{ href: '/jobs', label: 'Browse jobs' }}
      features={[
        'Kanban board: Applied, Interview, Assessment, Offer, Rejected, Archived',
        'Timeline view with status change history',
        'Application analytics and conversion insights',
        'Private notes and interview date tracking',
        'One-click apply from job listings',
        'Integrated with resume and cover letter tools',
      ]}
    />
  );
}
