import Link from 'next/link';
import { BarChart3, Megaphone, Users, CheckCircle } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata = buildMetadata({
  title: `Advertise With Us — ${siteConfig.name}`,
  description: `Reach Indian college students and fresh graduates through ${siteConfig.name}. Job listings, sponsored content, and display advertising options.`,
  path: '/advertise',
});

const offerings = [
  {
    icon: Megaphone,
    title: 'Featured job listings',
    description:
      'Pin your campus or fresher roles at the top of category and city pages for maximum visibility during placement season.',
  },
  {
    icon: Users,
    title: 'Employer branding',
    description:
      'Verified company profiles with logo, culture story, and aggregated openings — ideal for building campus employer brand.',
  },
  {
    icon: BarChart3,
    title: 'Display advertising',
    description:
      'Banner and in-feed placements on high-traffic job, blog, and prep pages reaching students actively job hunting.',
  },
];

const benefits = [
  'Audience of students and 0–2 year professionals across India',
  'Targeting by city, category, and content topic',
  'Transparent reporting on impressions and clicks',
  'Editorial compliance with our advertising policy',
  'Dedicated account support for volume employers',
];

export default function AdvertisePage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageHeader
        title="Advertise With Us"
        description={`Connect with India's next generation of talent through ${siteConfig.name}.`}
        breadcrumbs={
          <Breadcrumbs items={[{ name: 'Advertise', href: '/advertise' }]} />
        }
      />

      <p className="mt-8 max-w-3xl text-muted-foreground leading-relaxed">
        {siteConfig.name} attracts students preparing for campus placements, searching for
        internships, and building resumes. Whether you are a campus recruiter, HR team at a growing
        startup, or an ed-tech brand, we offer advertising and listing solutions designed for the
        Indian graduate market.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {offerings.map((item) => (
          <Card key={item.title}>
            <CardContent className="p-6">
              <item.icon className="h-8 w-8 text-brand-600" aria-hidden />
              <h3 className="mt-4 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 rounded-lg border p-8">
        <h2 className="text-xl font-semibold">Why advertise on {siteConfig.name}?</h2>
        <ul className="mt-6 space-y-3">
          {benefits.map((b) => (
            <li key={b} className="flex items-start gap-2 text-muted-foreground">
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden />
              {b}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 text-center">
        <p className="text-muted-foreground">
          Request our media kit and pricing by contacting our partnerships team.
        </p>
        <Button variant="brand" className="mt-6" size="lg" asChild>
          <Link href="/contact">Get in touch</Link>
        </Button>
      </div>
    </div>
  );
}
