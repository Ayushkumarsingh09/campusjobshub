import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { api } from '@/lib/api';
import { fetchOneWithFallback, fetchWithRetry } from '@/lib/fetch-content';
import { getFallbackRoadmap, resolveCanonicalSlug } from '@/lib/static-fallback-data';
import { FALLBACK_ROADMAP_SLUGS } from '@/lib/static-export-params';
import { buildMetadata } from '@/lib/seo';
import type { CareerRoadmap } from '@/types/api';
import { siteConfig } from '@/config/site';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdSlot } from '@/components/ads/ad-slot';
import { RelatedContent } from '@/components/content/related-content';
import { ContentImage } from '@/components/shared/content-image';
import { getRoadmapImage, resolveImageMeta } from '@/lib/images';

interface RoadmapDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getRoadmap(slug: string): Promise<CareerRoadmap | null> {
  const canonical = resolveCanonicalSlug(slug);
  return fetchOneWithFallback<CareerRoadmap>(
    `/roadmaps/${canonical}`,
    canonical,
    getFallbackRoadmap
  );
}

export async function generateStaticParams() {
  try {
    const roadmaps = await fetchWithRetry<CareerRoadmap[]>(() =>
      api.get<CareerRoadmap[]>('/roadmaps', { page: 1, limit: 50 })
    );
    const fromApi = (roadmaps ?? []).map((r) => ({ slug: r.slug }));
    return fromApi.length > 0 ? fromApi : FALLBACK_ROADMAP_SLUGS.map((slug) => ({ slug }));
  } catch {
    return FALLBACK_ROADMAP_SLUGS.map((slug) => ({ slug }));
  }
}

export async function generateMetadata({ params }: RoadmapDetailPageProps) {
  const { slug } = await params;
  const roadmap = await getRoadmap(slug);
  if (!roadmap) {
    return buildMetadata({
      title: 'Roadmap Not Found',
      description: 'The requested career roadmap could not be found.',
      path: `/prepare/roadmaps/${slug}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: `${roadmap.title} — Career Roadmap — ${siteConfig.name}`,
    description: roadmap.description ?? `Step-by-step ${roadmap.title} learning path for students.`,
    path: `/prepare/roadmaps/${roadmap.slug}`,
  });
}

export default async function RoadmapDetailPage({ params }: RoadmapDetailPageProps) {
  const { slug: rawSlug } = await params;
  const slug = resolveCanonicalSlug(rawSlug);
  const roadmap = await getRoadmap(slug);

  if (!roadmap) notFound();

  const steps = roadmap.steps ?? [];

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageHeader
        title={roadmap.title}
        description={roadmap.description ?? undefined}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: 'Roadmaps', href: '/prepare/roadmaps' },
              { name: roadmap.title, href: `/prepare/roadmaps/${roadmap.slug}` },
            ]}
          />
        }
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="secondary">{roadmap.difficulty}</Badge>
        {roadmap.estimatedHours && (
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" aria-hidden />
            {roadmap.estimatedHours} hours
          </Badge>
        )}
        <Badge variant="outline">{steps.length} steps</Badge>
      </div>

      {(() => {
        const hero = resolveImageMeta(
          roadmap.thumbnailUrl,
          getRoadmapImage(roadmap.topic, roadmap.slug),
          `${roadmap.title} learning path`
        );
        return (
          <ContentImage
            src={hero.src}
            alt={hero.alt}
            title={hero.title}
            className="mt-6"
            priority
            fallbackCategory="roadmap-web"
          />
        );
      })()}

      <AdSlot slotId="roadmap-detail-top" format="banner" className="my-8" adEligible />

      <div className="mt-8 space-y-4">
        {steps.length > 0 ? (
          steps
            .sort((a, b) => a.stepOrder - b.stepOrder)
            .map((step, index) => (
              <Card key={step.id}>
                <CardContent className="flex gap-4 p-6">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700 dark:bg-brand-900/40">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold">{step.title}</h2>
                    {step.description && (
                      <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      {step.estimatedHours && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" aria-hidden />
                          {step.estimatedHours}h
                        </span>
                      )}
                      {step.resourceUrl && (
                        <a
                          href={step.resourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          Resource
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                        </a>
                      )}
                    </div>
                  </div>
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-muted-foreground/40" aria-hidden />
                </CardContent>
              </Card>
            ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <p>Detailed steps for this roadmap are being prepared.</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/prepare/roadmaps">Browse other roadmaps</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <RelatedContent type="roadmap" slug={roadmap.slug} title="Related learning paths" />

      <AdSlot slotId="roadmap-detail-bottom" format="rectangle" className="mt-10" adEligible />
    </div>
  );
}
