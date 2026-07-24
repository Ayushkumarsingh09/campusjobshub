import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ToolLandingProps {
  title: string;
  description: string;
  path: string;
  breadcrumbName: string;
  ctaHref: string;
  ctaLabel: string;
  features: string[];
  secondaryCta?: { href: string; label: string };
}

export function ToolLanding({
  title,
  description,
  path,
  breadcrumbName,
  ctaHref,
  ctaLabel,
  features,
  secondaryCta,
}: ToolLandingProps) {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={<Breadcrumbs items={[{ name: breadcrumbName, href: path }]} />}
      />

      <div className="mt-10 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-12 text-center text-white sm:px-12">
        <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-brand-100">{description}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button size="lg" variant="secondary" asChild>
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
          {secondaryCta && (
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
            </Button>
          )}
        </div>
      </div>

      <Card className="mt-12">
        <CardContent className="p-8">
          <h3 className="text-xl font-semibold">Why students use this tool</h3>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-muted-foreground">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden />
                {f}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
