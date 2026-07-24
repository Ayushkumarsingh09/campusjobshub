'use client';

import { useEffect, useState } from 'react';
import { careerApi } from '@/lib/career-api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { APPLICATION_STATUS_LABELS } from '@/types/career';
import type { ApplicationStatus } from '@/types/career';
import { Skeleton } from '@/components/ui/skeleton';
import { timeAgo } from '@/lib/utils';

interface EmployerApplication {
  id: string;
  status: ApplicationStatus;
  appliedAt: string;
  user: { name: string; email: string; college?: string | null; skills: string[] };
  job?: { title: string } | null;
  internship?: { title: string } | null;
}

export default function EmployerApplicationsPage() {
  const [apps, setApps] = useState<EmployerApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await careerApi.getEmployerApplications();
    setApps((res.data as EmployerApplication[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: ApplicationStatus) => {
    await careerApi.updateEmployerApplication(id, { status });
    await load();
  };

  if (loading) return <Skeleton className="h-96" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Candidate Applications</h1>

      {apps.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No applications received yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {apps.map((app) => (
            <Card key={app.id}>
              <CardContent className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{app.user.name}</p>
                    <p className="text-sm text-muted-foreground">{app.user.email}</p>
                    <p className="text-sm mt-1">
                      Applied for: {app.job?.title ?? app.internship?.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {app.user.college} · {timeAgo(app.appliedAt)}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {app.user.skills.slice(0, 5).map((s) => (
                        <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  </div>
                  <select
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={app.status}
                    onChange={(e) => updateStatus(app.id, e.target.value as ApplicationStatus)}
                  >
                    {Object.entries(APPLICATION_STATUS_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
