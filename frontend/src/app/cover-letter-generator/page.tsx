import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { ToolLanding } from '@/components/marketing/tool-landing';

export const metadata = buildMetadata({
  title: `Cover Letter Generator for Campus Jobs — ${siteConfig.name}`,
  description:
    'Generate tailored cover letters for campus and fresher job applications. Multiple styles, resume integration, download and history.',
  path: '/cover-letter-generator',
});

export default function CoverLetterLandingPage() {
  return (
    <ToolLanding
      title="Cover Letter Generator"
      description="Create personalized cover letters using your resume data and job description. Professional, enthusiastic, concise, and storytelling styles."
      path="/cover-letter-generator"
      breadcrumbName="Cover Letter Generator"
      ctaHref="/resume/cover-letter"
      ctaLabel="Generate cover letter"
      features={[
        'Pulls skills and experience from your saved resume',
        'Paste job description for tailored content',
        'Four writing styles: professional, enthusiastic, concise, storytelling',
        'Copy to clipboard or download as text file',
        'Full history saved in your account',
        'Use directly when applying through CampusJobsHub',
      ]}
    />
  );
}
