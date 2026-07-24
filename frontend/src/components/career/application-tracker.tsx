'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { careerApi } from '@/lib/career-api';
import type { Application, ApplicationStatus } from '@/types/career';
import { APPLICATION_STATUS_LABELS, KANBAN_COLUMNS } from '@/types/career';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { timeAgo } from '@/lib/utils';
import { BarChart3, Clock, LayoutGrid } from 'lucide-react';

export function ApplicationTracker() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [analytics, setAnalytics] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [appsRes, analyticsRes] = await Promise.all([
        careerApi.listApplications(),
        careerApi.getApplicationAnalytics(),
      ]);
      setApplications(appsRes.data ?? []);
      setAnalytics(analyticsRes.data as Record<string, unknown> ?? null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id: string, status: ApplicationStatus) => {
    await careerApi.updateApplication(id, { status });
    await load();
  };

  if (loading) return <Skeleton className="h-96 w-full" />;

  const byColumn = (status: ApplicationStatus) =>
    applications.filter((a) => a.status === status);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Application Tracker</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track every campus application from submission to offer.
          </p>
        </div>
        <Button variant="brand" asChild>
          <Link href="/jobs">Find jobs to apply</Link>
        </Button>
      </div>

      {analytics && (
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{String(analytics.total ?? 0)}</p>
              <p className="text-xs text-muted-foreground">Total applications</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{String(analytics.active ?? 0)}</p>
              <p className="text-xs text-muted-foreground">Active pipeline</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{String(analytics.interviews ?? 0)}</p>
              <p className="text-xs text-muted-foreground">Interviews / assessments</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{String(analytics.offers ?? 0)}</p>
              <p className="text-xs text-muted-foreground">Offers received</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="kanban">
        <TabsList>
          <TabsTrigger value="kanban" className="gap-2">
            <LayoutGrid className="h-4 w-4" aria-hidden />
            Kanban
          </TabsTrigger>
          <TabsTrigger value="timeline" className="gap-2">
            <Clock className="h-4 w-4" aria-hidden />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" aria-hidden />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="mt-6">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {KANBAN_COLUMNS.map((status) => (
              <div key={status} className="min-w-[260px] shrink-0">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{APPLICATION_STATUS_LABELS[status]}</h3>
                  <Badge variant="secondary">{byColumn(status).length}</Badge>
                </div>
                <div className="space-y-3">
                  {byColumn(status).map((app) => {
                    const title = app.job?.title ?? app.internship?.title ?? 'Role';
                    const company = app.job?.company?.name ?? app.internship?.company?.name;
                    const href = app.job
                      ? `/jobs/${app.job.slug}`
                      : app.internship
                        ? `/internships/${app.internship.slug}`
                        : '#';
                    return (
                      <Card key={app.id} className="shadow-sm">
                        <CardContent className="p-4 space-y-2">
                          <Link href={href} className="font-medium text-sm hover:text-primary line-clamp-2">
                            {title}
                          </Link>
                          <p className="text-xs text-muted-foreground">{company}</p>
                          <p className="text-xs text-muted-foreground">Applied {timeAgo(app.appliedAt)}</p>
                          <select
                            className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
                            value={app.status}
                            onChange={(e) => updateStatus(app.id, e.target.value as ApplicationStatus)}
                          >
                            {KANBAN_COLUMNS.map((s) => (
                              <option key={s} value={s}>{APPLICATION_STATUS_LABELS[s]}</option>
                            ))}
                          </select>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <div className="relative space-y-0 border-l-2 border-muted ml-3 pl-8">
            {applications.map((app) => {
              const title = app.job?.title ?? app.internship?.title;
              const company = app.job?.company?.name ?? app.internship?.company?.name;
              return (
                <div key={app.id} className="relative pb-8">
                  <span className="absolute -left-[41px] flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 ring-4 ring-background" />
                  <p className="font-medium">{title}</p>
                  <p className="text-sm text-muted-foreground">{company}</p>
                  <Badge className="mt-2">{APPLICATION_STATUS_LABELS[app.status]}</Badge>
                  <p className="text-xs text-muted-foreground mt-1">Applied {timeAgo(app.appliedAt)}</p>
                  {app.events?.map((ev) => (
                    <p key={ev.id} className="text-xs text-muted-foreground mt-1">
                      → {ev.title ?? APPLICATION_STATUS_LABELS[ev.status]} ({timeAgo(ev.occurredAt)})
                    </p>
                  ))}
                </div>
              );
            })}
            {!applications.length && (
              <p className="text-muted-foreground text-sm">No applications in your timeline yet.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Status breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analytics?.byStatus && typeof analytics.byStatus === 'object'
                ? Object.entries(analytics.byStatus as Record<string, number>).map(([status, count]) => (
                    <div key={status} className="flex items-center gap-4">
                      <span className="w-40 text-sm">
                        {APPLICATION_STATUS_LABELS[status as ApplicationStatus] ?? status}
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-brand-600"
                          style={{
                            width: `${Math.min(100, (count / Math.max(1, Number(analytics.total))) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                    </div>
                  ))
                : (
                  <p className="text-muted-foreground text-sm">Apply to jobs to see analytics.</p>
                )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
