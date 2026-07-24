import Link from 'next/link';
import {
  Briefcase,
  Building2,
  Code,
  Megaphone,
  PenTool,
  TrendingUp,
  Users,
} from 'lucide-react';
import { fetchListWithFallback } from '@/lib/fetch-content';
import { FALLBACK_BLOG_POSTS, FALLBACK_FEATURED_JOBS } from '@/lib/static-fallback-data';
import { siteConfig } from '@/config/site';
import type { BlogPost, Job } from '@/types/api';
import { JobCard } from '@/components/cards/job-card';
import { BlogCard } from '@/components/cards/blog-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HomeHero } from '@/app/_components/home-hero';

const categories = [
  { name: 'Software Engineering', slug: 'software-engineering', icon: Code, count: '2,400+' },
  { name: 'Data & Analytics', slug: 'data-analytics', icon: TrendingUp, count: '890+' },
  { name: 'Marketing', slug: 'marketing', icon: Megaphone, count: '650+' },
  { name: 'Design', slug: 'design', icon: PenTool, count: '420+' },
  { name: 'HR & Operations', slug: 'hr-operations', icon: Users, count: '380+' },
  { name: 'Finance', slug: 'finance', icon: Building2, count: '310+' },
];

function formatJobLocation(job: Job): string {
  if (job.isRemote) return 'Remote';
  return [job.locationCity, job.locationState].filter(Boolean).join(', ') || 'India';
}

async function getFeaturedJobs(): Promise<Job[]> {
  return fetchListWithFallback('/jobs', { page: 1, limit: 6 }, FALLBACK_FEATURED_JOBS);
}

async function getBlogTeasers(): Promise<BlogPost[]> {
  const posts = await fetchListWithFallback('/blog', { page: 1, limit: 3 }, FALLBACK_BLOG_POSTS);
  return posts.slice(0, 3);
}

export default async function HomePage() {
  const [featuredJobs, blogPosts] = await Promise.all([getFeaturedJobs(), getBlogTeasers()]);

  return (
    <>
      <HomeHero />

      {/* Featured Jobs */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Featured Jobs</h2>
            <p className="mt-2 text-muted-foreground">
              Fresh campus and fresher openings updated daily
            </p>
          </div>
          <Button variant="outline" asChild className="hidden sm:inline-flex">
            <Link href="/jobs">View all jobs</Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredJobs.map((job) => (
            <JobCard
              key={job.id}
              title={job.title}
              slug={job.slug}
              company={job.company?.name ?? 'Company'}
              companySlug={job.company?.slug}
              location={formatJobLocation(job)}
              salary={{ min: job.salaryMin, max: job.salaryMax }}
              skills={job.skills}
              postedAt={job.publishedAt ?? job.createdAt}
              isRemote={job.isRemote}
            />
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Button variant="outline" asChild>
            <Link href="/jobs">View all jobs</Link>
          </Button>
        </div>
      </section>

      {/* Categories */}
      <section className="border-y bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">Browse by Category</h2>
          <p className="mt-2 text-center text-muted-foreground">
            Find roles that match your degree and interests
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/jobs?category=${cat.slug}`}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30">
                      <cat.icon className="h-6 w-6" aria-hidden />
                    </div>
                    <div>
                      <h3 className="font-semibold">{cat.name}</h3>
                      <p className="text-sm text-muted-foreground">{cat.count} openings</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials placeholder */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Student Success Stories</h2>
        <p className="mt-2 text-center text-muted-foreground">
          Real placements from students who used {siteConfig.name}
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              quote:
                'I landed a software engineering role at a product startup within 3 weeks of using CampusJobsHub. The interview prep section was a game changer.',
              name: 'Priya S.',
              role: 'B.Tech CSE, Pune',
            },
            {
              quote:
                'The ATS checker helped me fix my resume format. I started getting interview calls from TCS and Infosys after updating it.',
              name: 'Rahul M.',
              role: 'MCA, Bangalore',
            },
            {
              quote:
                'Found a paid summer internship with PPO through the internships filter. Highly recommend for final-year students.',
              name: 'Ananya K.',
              role: 'BBA, Mumbai',
            },
          ].map((t) => (
            <Card key={t.name} className="bg-muted/20">
              <CardContent className="p-6">
                <p className="text-sm leading-relaxed text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-4">
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Blog teasers */}
      <section className="border-t bg-muted/20 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Placement Tips & Guides</h2>
              <p className="mt-2 text-muted-foreground">
                Expert advice for campus placements and interviews
              </p>
            </div>
            <Button variant="outline" asChild className="hidden sm:inline-flex">
              <Link href="/blog">Read blog</Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.length > 0 ? (
              blogPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  title={post.title}
                  slug={post.slug}
                  excerpt={post.excerpt}
                  author={post.author?.name ?? 'Editorial Team'}
                  publishedAt={post.publishedAt ?? post.createdAt}
                  category={post.category?.name}
                  readingTime={post.readingTimeMinutes}
                  imageUrl={post.featuredImageUrl}
                />
              ))
            ) : (
              <>
                <BlogCard
                  title="How to Prepare for TCS NQT 2026"
                  slug="tcs-campus-hiring-guide-2026"
                  excerpt="A complete week-by-week study plan covering aptitude, coding, and interview rounds for TCS National Qualifier Test."
                  author="Editorial Team"
                  publishedAt={new Date().toISOString()}
                  category="Placement Prep"
                  readingTime={8}
                />
                <BlogCard
                  title="Top 50 HR Interview Questions for Freshers"
                  slug="hr-interview-questions-campus-placement"
                  excerpt="Practice answers for tell me about yourself, strengths, weaknesses, and salary expectations tailored for Indian campus hiring."
                  author="Editorial Team"
                  publishedAt={new Date().toISOString()}
                  category="Interviews"
                  readingTime={12}
                />
                <BlogCard
                  title="Resume Format for Campus Placements in India"
                  slug="ats-friendly-resume-format-india-2026"
                  excerpt="One-page resume templates, section ordering, and ATS-friendly tips that recruiters at Indian IT companies expect."
                  author="Editorial Team"
                  publishedAt={new Date().toISOString()}
                  category="Resume"
                  readingTime={6}
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="rounded-2xl bg-brand-600 px-6 py-12 text-center text-white sm:px-12">
          <Briefcase className="mx-auto h-10 w-10 opacity-90" aria-hidden />
          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">Ready to start your career?</h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">
            Create a free account to save jobs, build your resume with AI, and track applications
            from one dashboard.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/register">Create free account</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10"
              asChild
            >
              <Link href="/jobs">Browse jobs</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
