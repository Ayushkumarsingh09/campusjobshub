import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { ToolLanding } from '@/components/marketing/tool-landing';

export const metadata = buildMetadata({
  title: `ATS Resume Checker — Score Your Resume Free — ${siteConfig.name}`,
  description:
    'Check your resume ATS score, keyword match, formatting analysis, and get actionable improvement tips for campus job applications in India.',
  path: '/ats-resume-checker',
});

export default function AtsCheckerLandingPage() {
  return (
    <ToolLanding
      title="ATS Resume Checker"
      description="Scan your resume against job descriptions. Get ATS score, keyword gaps, section analysis, and a week-by-week improvement plan."
      path="/ats-resume-checker"
      breadcrumbName="ATS Checker"
      ctaHref="/resume/ats-checker"
      ctaLabel="Check my resume"
      features={[
        'Overall ATS score with keyword and formatting breakdown',
        'Match resume against any job description paste',
        'Missing keywords and skills detection',
        'Section-by-section formatting analysis',
        'Personalized suggestions and improvement plan',
        'Scan history saved to your career dashboard',
      ]}
    />
  );
}
