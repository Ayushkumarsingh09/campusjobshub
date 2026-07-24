import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { AuthGuard } from '@/components/auth/auth-guard';
import { AtsCheckerShell } from '@/app/_components/ats-checker-shell';

export const metadata = buildMetadata({
  title: `ATS Resume Checker — ${siteConfig.name}`,
  description:
    'Check if your resume passes Applicant Tracking Systems. Get keyword match scores and formatting suggestions.',
  path: '/resume/ats-checker',
  noIndex: true,
});

export default function AtsCheckerPage() {
  return (
    <AuthGuard redirectTo="/auth/login">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <PageHeader
          title="ATS Checker"
          description="Compare your resume against a job description and improve your ATS compatibility score."
          breadcrumbs={
            <Breadcrumbs
              items={[
                { name: 'Resume AI', href: '/resume' },
                { name: 'ATS Checker', href: '/resume/ats-checker' },
              ]}
            />
          }
        />
        <div className="mt-8">
          <AtsCheckerShell />
        </div>
      </div>
    </AuthGuard>
  );
}
