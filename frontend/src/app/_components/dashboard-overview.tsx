'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, FileText, Bookmark, Send, Target, Sparkles } from 'lucide-react';
import { useSession } from '@/components/providers/session-provider';
import { StatCard } from '@/components/dashboard/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { careerApi } from '@/lib/career-api';
import type { CareerOverview } from '@/types/career';
import { APPLICATION_STATUS_LABELS } from '@/types/career';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardOverview() {
  const { user } = useSession();
  const [data, setData] = useState<CareerOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    careerApi
      .getOverview()
      .then((res) => setData(res.data ?? null))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Career Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back, <span className="font-medium text-foreground">{user?.name}</span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Applications"
          value={stats?.applications ?? 0}
          icon={Send}
          description="Total submitted"
        />
        <StatCard
          title="Saved Jobs"
          value={stats?.savedJobs ?? 0}
          icon={Bookmark}
          description="Bookmarked listings"
        />
        <StatCard
          title="ATS Score"
          value={stats?.atsScore != null ? `${stats.atsScore}%` : '—'}
          icon={Target}
          description="Latest resume scan"
        />
        <StatCard
          title="Profile"
          value={`${stats?.profileCompletion ?? user?.profileCompletion ?? 0}%`}
          icon={Briefcase}
          description="Completion score"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button variant="brand" asChild>
              <Link href="/jobs">Browse jobs</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/resume/builder">Edit resume</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/resume/ats-checker">ATS check</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/applications">Track applications</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-4 w-4" aria-hidden />
              Recommended jobs
            </CardTitle>
            <Button variant="link" className="h-auto p-0" asChild>
              <Link href="/dashboard/recommendations">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.recommendations.jobs.length ? (
              data.recommendations.jobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.slug}`}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium text-sm">{job.title}</p>
                    <p className="text-xs text-muted-foreground">{job.company?.name}</p>
                  </div>
                  <Badge variant="secondary">{job.matchPercent}% match</Badge>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Complete your profile and add skills to get personalized job matches.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {data?.skillGap && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Skill gaps for {user?.targetRole ?? 'your target role'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              {data.skillGap.matchPercent}% skill match — focus on these next:
            </p>
            <div className="flex flex-wrap gap-2">
              {data.skillGap.missingSkills.map((s) => (
                <Badge key={s} variant="outline">{s}</Badge>
              ))}
            </div>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/dashboard/skills">Full skill gap analysis</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent applications</CardTitle>
          <Button variant="link" className="h-auto p-0" asChild>
            <Link href="/dashboard/applications">View tracker</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {data?.recentApplications.length ? (
            <ul className="space-y-3">
              {data.recentApplications.map((app) => {
                const title = app.job?.title ?? app.internship?.title ?? 'Application';
                const company = app.job?.company?.name ?? app.internship?.company?.name;
                return (
                  <li key={app.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium text-sm">{title}</p>
                      <p className="text-xs text-muted-foreground">{company}</p>
                    </div>
                    <Badge>{APPLICATION_STATUS_LABELS[app.status]}</Badge>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No applications yet.{' '}
              <Link href="/jobs" className="text-primary hover:underline">Browse jobs</Link> to get started.
            </p>
          )}
        </CardContent>
      </Card>

      {data?.roadmapProgress.length ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Roadmap progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.roadmapProgress.map((rp) => (
              <div key={rp.roadmap.slug}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{rp.roadmap.title}</span>
                  <span className="text-muted-foreground">{rp.progressPercent}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-brand-600 transition-all"
                    style={{ width: `${rp.progressPercent}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
