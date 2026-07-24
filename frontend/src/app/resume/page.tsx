import Link from 'next/link';
import { FileText, ScanSearch, Mail, LayoutTemplate, Sparkles, CheckCircle } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata = buildMetadata({
  title: `AI Resume Tools for Campus Placements — ${siteConfig.name}`,
  description:
    'Build ATS-friendly resumes, check your score, generate cover letters, and browse templates — free tools for Indian students.',
  path: '/resume',
});

const tools = [
  {
    icon: FileText,
    title: 'Resume Builder',
    description: 'Create a professional one-page resume with guided sections and real-time preview.',
    href: '/resume/builder',
  },
  {
    icon: ScanSearch,
    title: 'ATS Checker',
    description: 'Scan your resume against job descriptions and get actionable improvement tips.',
    href: '/resume/ats-checker',
  },
  {
    icon: Mail,
    title: 'Cover Letter Generator',
    description: 'Generate tailored cover letters for campus and fresher job applications.',
    href: '/resume/cover-letter',
  },
  {
    icon: LayoutTemplate,
    title: 'Resume Templates',
    description: 'Browse India-friendly resume templates for engineering, MBA, and arts graduates.',
    href: '/resume/templates',
  },
];

const features = [
  'ATS-optimized formatting for Indian recruiters',
  'One-page layouts preferred by campus HR teams',
  'Export to PDF for applications',
  'Keyword suggestions for IT and non-IT roles',
  'Free tier with premium upgrades coming soon',
];

export default function ResumeLandingPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageHeader
        title="Resume AI"
        description="Build, optimize, and export resumes that get noticed by campus recruiters."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Resume AI', href: '/resume' }]} />}
      />

      <div className="mt-10 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-12 text-center text-white sm:px-12">
        <Sparkles className="mx-auto h-10 w-10 opacity-90" aria-hidden />
        <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
          Land more interviews with an ATS-ready resume
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-brand-100">
          Indian companies use Applicant Tracking Systems to filter thousands of campus applications.
          Our AI tools help your resume pass the first screen.
        </p>
        <Button size="lg" variant="secondary" className="mt-8" asChild>
          <Link href="/resume/builder">Start building free</Link>
        </Button>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {tools.map((tool) => (
          <Card key={tool.href} className="transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <tool.icon className="h-8 w-8 text-brand-600" aria-hidden />
              <h3 className="mt-4 text-lg font-semibold">{tool.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{tool.description}</p>
              <Button variant="link" className="mt-4 h-auto p-0" asChild>
                <Link href={tool.href}>Open tool →</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 rounded-lg border p-8">
        <h2 className="text-xl font-semibold">Why students choose our resume tools</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-muted-foreground">
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
