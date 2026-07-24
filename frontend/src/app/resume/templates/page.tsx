import Link from 'next/link';
import { FileText } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata = buildMetadata({
  title: `Resume Templates for Students — ${siteConfig.name}`,
  description:
    'Free resume templates for engineering, MBA, BCA, and arts graduates. ATS-friendly one-page formats for Indian campus hiring.',
  path: '/resume/templates',
});

const templates = [
  {
    name: 'Classic Fresher',
    description: 'Clean one-page layout ideal for IT and engineering campus placements.',
    category: 'Engineering',
    popular: true,
  },
  {
    name: 'Modern Minimal',
    description: 'Contemporary design with clear section hierarchy for startups and product companies.',
    category: 'Tech',
    popular: true,
  },
  {
    name: 'MBA Professional',
    description: 'Structured format highlighting education, internships, and leadership experience.',
    category: 'MBA',
    popular: false,
  },
  {
    name: 'Creative Portfolio',
    description: 'Balanced layout for design, media, and creative roles with project showcase.',
    category: 'Design',
    popular: false,
  },
  {
    name: 'Government & PSU',
    description: 'Formal format suitable for PSU, bank, and government job applications.',
    category: 'Public Sector',
    popular: false,
  },
  {
    name: 'Internship Focus',
    description: 'Emphasizes projects, coursework, and skills when work experience is limited.',
    category: 'Students',
    popular: true,
  },
];

export default function ResumeTemplatesPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageHeader
        title="Resume Templates"
        description="Choose an ATS-friendly template and customize it in our resume builder."
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: 'Resume AI', href: '/resume' },
              { name: 'Templates', href: '/resume/templates' },
            ]}
          />
        }
      />

      <p className="mt-6 max-w-3xl text-muted-foreground">
        All templates are optimized for Indian recruiters who prefer concise one-page resumes.
        Select a template, then open the builder to add your details and export as PDF.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.name} className="transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex aspect-[3/4] items-center justify-center rounded-lg border-2 border-dashed bg-muted/30">
                <FileText className="h-12 w-12 text-muted-foreground/50" aria-hidden />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <h3 className="font-semibold">{template.name}</h3>
                {template.popular && <Badge variant="success">Popular</Badge>}
              </div>
              <Badge variant="outline" className="mt-2">
                {template.category}
              </Badge>
              <p className="mt-3 text-sm text-muted-foreground">{template.description}</p>
              <Button variant="brand" className="mt-4 w-full" asChild>
                <Link href="/resume/builder">Use this template</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
