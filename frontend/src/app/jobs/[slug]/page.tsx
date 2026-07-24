import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Wifi, Clock, IndianRupee, Building2 } from 'lucide-react';
import { api } from '@/lib/api';
import { fetchOneWithFallback, fetchWithRetry } from '@/lib/fetch-content';
import { getFallbackJob } from '@/lib/static-fallback-data';
import { FALLBACK_JOB_SLUGS } from '@/lib/static-export-params';
import { buildMetadata, jobPostingJsonLd } from '@/lib/seo';
import { formatSalary, timeAgo } from '@/lib/utils';
import type { Job } from '@/types/api';
import { siteConfig } from '@/config/site';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AdSlot } from '@/components/ads/ad-slot';
import { Separator } from '@/components/ui/separator';
import { RelatedContent } from '@/components/content/related-content';
import { JobDetailActions } from '@/components/career/job-detail-actions';
import { ContentImage } from '@/components/shared/content-image';
import { getJobImage, resolveImageMeta } from '@/lib/images';
import {
  CityJobsPage,
  buildCityJobMetadata,
  cityJobStaticParams,
  isCityJobSlug,
} from '@/app/_components/city-jobs-page';

interface JobDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getJob(slug: string): Promise<Job | null> {
  return fetchOneWithFallback<Job>(`/jobs/${slug}`, slug, getFallbackJob);
}

export async function generateStaticParams() {
  const cityParams = cityJobStaticParams();
  try {
    const jobs = await fetchWithRetry<Job[]>(() => api.get<Job[]>('/jobs', { page: 1, limit: 100 }));
    const jobParams = (jobs ?? []).map((job) => ({ slug: job.slug }));
    if (jobParams.length > 0) return [...cityParams, ...jobParams];
    const { FALLBACK_CITY_SLUGS } = await import('@/lib/static-export-params');
    return [
      ...cityParams,
      ...FALLBACK_JOB_SLUGS.map((slug) => ({ slug })),
      ...FALLBACK_CITY_SLUGS.map((slug) => ({ slug })),
    ];
  } catch {
    const { FALLBACK_CITY_SLUGS } = await import('@/lib/static-export-params');
    return [
      ...cityParams,
      ...FALLBACK_JOB_SLUGS.map((slug) => ({ slug })),
      ...FALLBACK_CITY_SLUGS.map((slug) => ({ slug })),
    ];
  }
}

export async function generateMetadata({ params }: JobDetailPageProps) {
  const { slug } = await params;
  if (isCityJobSlug(slug)) return buildCityJobMetadata(slug);
  const job = await getJob(slug);
  if (!job) {
    return buildMetadata({
      title: 'Job Not Found',
      description: 'The requested job listing could not be found.',
      path: `/jobs/${slug}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: job.metaTitle ?? `${job.title} at ${job.company?.name ?? 'Company'}`,
    description:
      job.metaDescription ??
      job.description.slice(0, 160),
    path: `/jobs/${job.slug}`,
  });
}

function formatLocation(job: Job): string {
  if (job.isRemote) return 'Remote';
  return [job.locationCity, job.locationState].filter(Boolean).join(', ') || 'India';
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params;
  if (isCityJobSlug(slug)) return <CityJobsPage slug={slug} />;

  const job = await getJob(slug);

  if (!job) notFound();

  const location = formatLocation(job);
  const salaryText = formatSalary(job.salaryMin, job.salaryMax);

  return (
    <>
      {job.company && (
        <JsonLd
          data={jobPostingJsonLd({
            ...job,
            company: job.company,
          })}
        />
      )}

      <div className="container mx-auto px-4 py-8 sm:py-12">
        <PageHeader
          title={job.title}
          description={`${job.company?.name ?? 'Company'} · ${location}`}
          breadcrumbs={
            <Breadcrumbs
              items={[
                { name: 'Jobs', href: '/jobs' },
                { name: job.title, href: `/jobs/${job.slug}` },
              ]}
            />
          }
        />

        {(() => {
          const hero = resolveImageMeta(
            job.ogImageUrl,
            getJobImage({ isRemote: job.isRemote, isFresher: job.experienceMin === 0 }),
            `${job.title} career opportunity`
          );
          return (
            <ContentImage
              src={hero.src}
              alt={hero.alt}
              title={hero.title}
              className="mt-8"
              priority
              fallbackCategory={job.isRemote ? 'job-remote' : 'job-career'}
            />
          );
        })()}

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-wrap gap-2">
              {job.isRemote && (
                <Badge variant="success" className="gap-1">
                  <Wifi className="h-3 w-3" aria-hidden />
                  Remote
                </Badge>
              )}
              <Badge variant="secondary">{job.employmentType.replace('_', ' ')}</Badge>
              {job.experienceMin === 0 && <Badge variant="outline">Fresher</Badge>}
            </div>

            <AdSlot slotId="job-detail-top" format="banner" adEligible />

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold">Job Description</h2>
                <div className="prose prose-slate dark:prose-invert mt-4 max-w-none whitespace-pre-wrap text-muted-foreground">
                  {job.description}
                </div>
              </CardContent>
            </Card>

            {job.skills.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold">Required Skills</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
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
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <IndianRupee className="h-4 w-4 shrink-0" aria-hidden />
                    <span>{salaryText}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                    <span>{location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 shrink-0" aria-hidden />
                    <span>Posted {timeAgo(job.publishedAt ?? job.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-4 w-4 shrink-0" aria-hidden />
                    <span>
                      {job.experienceMin}
                      {job.experienceMax ? `–${job.experienceMax}` : '+'} years exp.
                    </span>
                  </div>
                </div>

                <Separator />

                <JobDetailActions
                  jobId={job.id}
                  jobSlug={job.slug}
                  applicationMethod={job.applicationMethod}
                  externalApplyUrl={job.externalApplyUrl}
                  careersPageUrl={job.company?.careersPageUrl}
                />

                {job.company && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/companies/${job.company.slug}`}>View company profile</Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            <AdSlot slotId="job-detail-sidebar" format="sidebar" adEligible />
          </aside>
        </div>

        <div className="mt-12">
          <RelatedContent type="job" slug={job.slug} />
        </div>
      </div>
    </>
  );
}
