import Link from 'next/link';
import { Target, Users, Zap, Heart } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdSlot } from '@/components/ads/ad-slot';
import { aboutMissionParagraphs } from '@/content/legal';

export const metadata = buildMetadata({
  title: `About Us — ${siteConfig.name}`,
  description: `Learn about ${siteConfig.name}, India's platform for campus jobs, internships, placement preparation, and AI-powered career tools.`,
  path: '/about',
});

const values = [
  {
    icon: Target,
    title: 'Student-first',
    description:
      'Every feature we build starts with a real placement challenge faced by Indian college students.',
  },
  {
    icon: Zap,
    title: 'Fast & accessible',
    description:
      'Free job listings, resume tools, and prep content accessible on any device across India.',
  },
  {
    icon: Users,
    title: 'Trusted by employers',
    description:
      'Verified companies post campus and fresher roles with transparent salary and location details.',
  },
  {
    icon: Heart,
    title: 'Quality content',
    description:
      'Editorial standards ensure our guides, interview questions, and roadmaps are accurate and helpful.',
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageHeader
        title={`About ${siteConfig.name}`}
        description="We help millions of Indian students discover campus jobs, internships, and the skills they need to get hired."
        breadcrumbs={
          <Breadcrumbs items={[{ name: 'About', href: '/about' }]} />
        }
      />

      <AdSlot slotId="about-top" format="banner" className="my-8" adEligible />

      <div className="mt-10 max-w-3xl space-y-6 text-muted-foreground leading-relaxed">
        {aboutMissionParagraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {values.map((v) => (
          <Card key={v.title}>
            <CardContent className="p-6">
              <v.icon className="h-8 w-8 text-brand-600" aria-hidden />
              <h3 className="mt-4 font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 rounded-lg border bg-muted/20 p-8 text-center">
        <h2 className="text-xl font-semibold">Want to work with us?</h2>
        <p className="mt-2 text-muted-foreground">
          Employers, campuses, and content partners — we would love to hear from you.
        </p>
        <Button variant="brand" className="mt-6" asChild>
          <Link href="/contact">Contact us</Link>
        </Button>
      </div>
    </div>
  );
}
