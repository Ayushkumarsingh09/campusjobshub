import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { AuthGuard } from '@/components/auth/auth-guard';
import { CoverLetterShell } from '@/app/_components/cover-letter-shell';

export const metadata = buildMetadata({
  title: `Cover Letter Generator — ${siteConfig.name}`,
  description: 'Generate tailored cover letters for campus and fresher job applications in India.',
  path: '/resume/cover-letter',
  noIndex: true,
});

export default function CoverLetterPage() {
  return (
    <AuthGuard redirectTo="/auth/login">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <PageHeader
          title="Cover Letter Generator"
          description="Create a professional cover letter customized for your target company and role."
          breadcrumbs={
            <Breadcrumbs
              items={[
                { name: 'Resume AI', href: '/resume' },
                { name: 'Cover Letter', href: '/resume/cover-letter' },
              ]}
            />
          }
        />
        <div className="mt-8">
          <CoverLetterShell />
        </div>
      </div>
    </AuthGuard>
  );
}
