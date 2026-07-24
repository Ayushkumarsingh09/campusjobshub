import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { ToolLanding } from '@/components/marketing/tool-landing';

export const metadata = buildMetadata({
  title: `Free Resume Builder for Campus Placements — ${siteConfig.name}`,
  description:
    'Build ATS-friendly resumes with multiple templates, live preview, drag-and-drop sections, and PDF export. Designed for Indian engineering and MBA students.',
  path: '/resume-builder',
});

export default function ResumeBuilderLandingPage() {
  return (
    <ToolLanding
      title="Resume Builder"
      description="Create professional, ATS-optimized resumes with guided sections, modern templates, and one-click PDF export — built for Indian campus placements."
      path="/resume-builder"
      breadcrumbName="Resume Builder"
      ctaHref="/resume/builder"
      ctaLabel="Start building free"
      secondaryCta={{ href: '/resume/templates', label: 'Browse templates' }}
      features={[
        '6 professional templates including ATS-minimal and tech layouts',
        'Live preview with personal info, education, experience, projects, and skills',
        'Drag-and-drop section reordering',
        'Resume versioning with draft and publish states',
        'PDF export optimized for Indian recruiters',
        'Auto-save and duplicate resume versions',
      ]}
    />
  );
}
