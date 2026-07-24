import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { AuthGuard } from '@/components/auth/auth-guard';
import { ResumeBuilderShell } from '@/app/_components/resume-builder-shell';

export const metadata = buildMetadata({
  title: `Resume Builder — ${siteConfig.name}`,
  description: 'Build a professional ATS-friendly resume with our guided editor. Free for students.',
  path: '/resume/builder',
  noIndex: true,
});

export default function ResumeBuilderPage() {
  return (
    <AuthGuard redirectTo="/auth/login">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <PageHeader
          title="Resume Builder"
          description="Create and edit your resume with live preview and section-by-section guidance."
          breadcrumbs={
            <Breadcrumbs
              items={[
                { name: 'Resume AI', href: '/resume' },
                { name: 'Builder', href: '/resume/builder' },
              ]}
            />
          }
        />
        <div className="mt-8">
          <ResumeBuilderShell />
        </div>
      </div>
    </AuthGuard>
  );
}
