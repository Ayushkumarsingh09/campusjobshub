import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Wifi, Clock, Calendar, Award, ExternalLink } from 'lucide-react';
import { api } from '@/lib/api';
import { fetchOneWithFallback, fetchWithRetry } from '@/lib/fetch-content';
import { getFallbackInternship } from '@/lib/static-fallback-data';
import { FALLBACK_INTERNSHIP_SLUGS } from '@/lib/static-export-params';
import { buildMetadata } from '@/lib/seo';
import { formatStipend, timeAgo } from '@/lib/utils';
import type { Internship } from '@/types/api';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AdSlot } from '@/components/ads/ad-slot';
import { Separator } from '@/components/ui/separator';
import { RelatedContent } from '@/components/content/related-content';
import { InternshipDetailActions } from '@/components/career/internship-detail-actions';
import { ContentImage } from '@/components/shared/content-image';
import { getInternshipImage, resolveImageMeta } from '@/lib/images';
import {
  CityInternshipsPage,
  buildCityInternshipMetadata,
  cityInternshipStaticParams,
  isCityInternshipSlug,
} from '@/app/_components/city-internships-page';

interface InternshipDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getInternship(slug: string): Promise<Internship | null> {
  return fetchOneWithFallback<Internship>(`/internships/${slug}`, slug, getFallbackInternship);
}

export async function generateStaticParams() {
  const cityParams = cityInternshipStaticParams();
  try {
    const items = await fetchWithRetry<Internship[]>(() =>
      api.get<Internship[]>('/internships', { page: 1, limit: 100 })
    );
    const itemParams = (items ?? []).map((item) => ({ slug: item.slug }));
    if (itemParams.length > 0) return [...cityParams, ...itemParams];
    const { FALLBACK_CITY_SLUGS } = await import('@/lib/static-export-params');
    return [
      ...cityParams,
      ...FALLBACK_INTERNSHIP_SLUGS.map((slug) => ({ slug })),
      ...FALLBACK_CITY_SLUGS.map((slug) => ({ slug })),
    ];
  } catch {
    const { FALLBACK_CITY_SLUGS } = await import('@/lib/static-export-params');
    return [
      ...cityParams,
      ...FALLBACK_INTERNSHIP_SLUGS.map((slug) => ({ slug })),
      ...FALLBACK_CITY_SLUGS.map((slug) => ({ slug })),
    ];
  }
}

export async function generateMetadata({ params }: InternshipDetailPageProps) {
  const { slug } = await params;
  if (isCityInternshipSlug(slug)) return buildCityInternshipMetadata(slug);
  const item = await getInternship(slug);
  if (!item) {
    return buildMetadata({
      title: 'Internship Not Found',
      description: 'The requested internship could not be found.',
      path: `/internships/${slug}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: item.metaTitle ?? `${item.title} at ${item.company?.name ?? 'Company'}`,
    description: item.metaDescription ?? item.description.slice(0, 160),
    path: `/internships/${item.slug}`,
  });
}

function formatLocation(item: Internship): string {
  if (item.isRemote) return 'Remote';
  return [item.locationCity, item.locationState].filter(Boolean).join(', ') || 'India';
}

export default async function InternshipDetailPage({ params }: InternshipDetailPageProps) {
  const { slug } = await params;
  if (isCityInternshipSlug(slug)) return <CityInternshipsPage slug={slug} />;

  const item = await getInternship(slug);

  if (!item) notFound();

  const location = formatLocation(item);
  const stipendText = formatStipend(item.stipendMin, item.stipendMax);

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageHeader
        title={item.title}
        description={`${item.company?.name ?? 'Company'} · ${location}`}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: 'Internships', href: '/internships' },
              { name: item.title, href: `/internships/${item.slug}` },
            ]}
          />
        }
      />

      {(() => {
        const hero = resolveImageMeta(
          item.ogImageUrl,
          getInternshipImage(0),
          `${item.title} internship opportunity`
        );
        return (
          <ContentImage
            src={hero.src}
            alt={hero.alt}
            title={hero.title}
            className="mt-8"
            priority
            fallbackCategory="internship-students"
          />
        );
      })()}

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-wrap gap-2">
            {item.isRemote && <Badge variant="success">Remote</Badge>}
            {item.ppoAvailable && (
              <Badge variant="warning" className="gap-1">
                <Award className="h-3 w-3" aria-hidden />
                PPO Available
              </Badge>
            )}
            {item.isPaid ? (
              <Badge variant="secondary">Paid</Badge>
            ) : (
              <Badge variant="outline">Unpaid</Badge>
            )}
          </div>

          <AdSlot slotId="internship-detail-top" format="banner" adEligible />

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold">Internship Description</h2>
              <div className="prose prose-slate dark:prose-invert mt-4 max-w-none whitespace-pre-wrap text-muted-foreground">
                {item.description}
              </div>
            </CardContent>
          </Card>

          {item.skills.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold">Skills</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <aside className="space-y-4">
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{stipendText}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                  {location}
                </div>
                {item.durationMonths && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 shrink-0" aria-hidden />
                    {item.durationMonths} month{item.durationMonths !== 1 ? 's' : ''}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0" aria-hidden />
                  Posted {timeAgo(item.publishedAt ?? item.createdAt)}
                </div>
              </div>

              <Separator />

              <InternshipDetailActions
                internshipId={item.id}
                slug={item.slug}
                applicationMethod={item.applicationMethod}
                externalApplyUrl={item.externalApplyUrl}
                careersPageUrl={item.company?.careersPageUrl}
              />

              {item.company && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/companies/${item.company.slug}`}>View company</Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <AdSlot slotId="internship-detail-sidebar" format="sidebar" adEligible />
        </aside>
      </div>

      <div className="mt-12">
        <RelatedContent type="internship" slug={item.slug} />
      </div>
    </div>
  );
}
