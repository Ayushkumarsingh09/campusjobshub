import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Globe, MapPin, Briefcase, BadgeCheck } from 'lucide-react';
import { api } from '@/lib/api';
import { fetchOneWithFallback } from '@/lib/fetch-content';
import { getFallbackCompany } from '@/lib/static-fallback-data';
import { buildMetadata } from '@/lib/seo';
import type { Company, Job, Internship } from '@/types/api';
import { siteConfig } from '@/config/site';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { JobCard } from '@/components/cards/job-card';
import { InternshipCard } from '@/components/cards/internship-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AdSlot } from '@/components/ads/ad-slot';
import { RelatedContent } from '@/components/content/related-content';
import { SaveCompanyButton } from '@/components/career/save-company-button';
import { ContentImage } from '@/components/shared/content-image';
import { CompanyLogo } from '@/components/shared/company-logo';
import { getCompanyImage, resolveImageMeta } from '@/lib/images';
import { fetchWithRetry } from '@/lib/fetch-content';
import { FALLBACK_COMPANY_SLUGS } from '@/lib/static-export-params';

interface CompanyDetailPageProps {
  params: Promise<{ slug: string }>;
}

interface CompanyDetail extends Company {
  jobs?: Job[];
  internships?: Internship[];
}

async function getCompany(slug: string): Promise<CompanyDetail | null> {
  return fetchOneWithFallback<CompanyDetail>(`/companies/${slug}`, slug, getFallbackCompany);
}

export async function generateStaticParams() {
  try {
    const companies = await fetchWithRetry<Company[]>(() =>
      api.get<Company[]>('/companies', { page: 1, limit: 100 })
    );
    const fromApi = (companies ?? []).map((c) => ({ slug: c.slug }));
    return fromApi.length > 0 ? fromApi : FALLBACK_COMPANY_SLUGS.map((slug) => ({ slug }));
  } catch {
    return FALLBACK_COMPANY_SLUGS.map((slug) => ({ slug }));
  }
}

export async function generateMetadata({ params }: CompanyDetailPageProps) {
  const { slug } = await params;
  const company = await getCompany(slug);
  if (!company) {
    return buildMetadata({
      title: 'Company Not Found',
      description: 'The requested company profile could not be found.',
      path: `/companies/${slug}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: `${company.name} — Jobs & Internships — ${siteConfig.name}`,
    description:
      company.description?.slice(0, 160) ??
      `View jobs and internships at ${company.name}. Campus hiring and fresher openings.`,
    path: `/companies/${company.slug}`,
  });
}

function formatLocation(item: {
  isRemote: boolean;
  locationCity?: string | null;
  locationState?: string | null;
}): string {
  if (item.isRemote) return 'Remote';
  return [item.locationCity, item.locationState].filter(Boolean).join(', ') || 'India';
}

export default async function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const { slug } = await params;
  const company = await getCompany(slug);

  if (!company) notFound();

  const location = [company.headquartersCity, company.headquartersState]
    .filter(Boolean)
    .join(', ');

  let jobs: Job[] = [];
  let internships: Internship[] = [];

  try {
    const [jobsRes, internshipsRes] = await Promise.all([
      api.get<Job[]>('/jobs', { page: 1, limit: 6, search: company.name }),
      api.get<Internship[]>('/internships', { page: 1, limit: 6, search: company.name }),
    ]);
    jobs = jobsRes.data ?? [];
    internships = internshipsRes.data ?? [];
  } catch {
    // listings optional
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageHeader
        title={company.name}
        description={company.industry ?? 'Company profile'}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: 'Companies', href: '/companies' },
              { name: company.name, href: `/companies/${company.slug}` },
            ]}
          />
        }
      />

      {(() => {
        const hero = resolveImageMeta(company.ogImageUrl, getCompanyImage(company.slug), `${company.name} workplace`);
        return (
          <ContentImage
            src={hero.src}
            alt={hero.alt}
            title={hero.title}
            width={hero.width}
            height={hero.height}
            className="mt-8"
            priority
            caption={`${company.name} — campus hiring and career opportunities in India`}
            fallbackCategory="company-tech"
          />
        );
      })()}

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <CompanyLogo
                  name={company.name}
                  slug={company.slug}
                  logoUrl={company.logoUrl}
                  size={64}
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold">{company.name}</h2>
                    {company.isVerified && (
                      <Badge variant="success" className="gap-1">
                        <BadgeCheck className="h-3 w-3" aria-hidden />
                        Verified
                      </Badge>
                    )}
                  </div>
                  {company.industry && (
                    <p className="mt-1 text-muted-foreground">{company.industry}</p>
                  )}
                  <div className="mt-3">
                    <SaveCompanyButton companyId={company.id} />
                  </div>
                </div>
              </div>

              {company.description && (
                <p className="mt-6 leading-relaxed text-muted-foreground">{company.description}</p>
              )}
            </CardContent>
          </Card>

          <AdSlot slotId="company-detail-top" format="banner" adEligible />

          {jobs.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold">Open Jobs</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    title={job.title}
                    slug={job.slug}
                    company={company.name}
                    companySlug={company.slug}
                    location={formatLocation(job)}
                    salary={{ min: job.salaryMin, max: job.salaryMax }}
                    skills={job.skills}
                    postedAt={job.publishedAt ?? job.createdAt}
                    isRemote={job.isRemote}
                  />
                ))}
              </div>
            </section>
          )}

          {internships.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold">Internships</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {internships.map((item) => (
                  <InternshipCard
                    key={item.id}
                    title={item.title}
                    slug={item.slug}
                    company={company.name}
                    companySlug={company.slug}
                    location={formatLocation(item)}
                    stipend={{ min: item.stipendMin, max: item.stipendMax }}
                    duration={item.durationMonths ? `${item.durationMonths} months` : 'Flexible'}
                    ppo={item.ppoAvailable}
                    skills={item.skills}
                    postedAt={item.publishedAt ?? item.createdAt}
                    isRemote={item.isRemote}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <Card>
            <CardContent className="space-y-4 p-6 text-sm">
              {location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                  {location}
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-4 w-4 shrink-0" aria-hidden />
                {company.jobCount} jobs · {company.internshipCount} internships
              </div>
              {company.website && (
                <Button variant="outline" className="w-full" asChild>
                  <a href={company.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4" aria-hidden />
                    Visit website
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
          <AdSlot slotId="company-detail-sidebar" format="sidebar" adEligible />
        </aside>
      </div>

      <RelatedContent type="company" slug={company.slug} title="Related jobs & guides" />
    </div>
  );
}
