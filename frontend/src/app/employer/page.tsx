'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, Send, Building2, Users } from 'lucide-react';
import { careerApi } from '@/lib/career-api';
import { StatCard } from '@/components/dashboard/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function EmployerDashboardPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    careerApi.getEmployerOverview().then((res) => {
      setData(res.data as Record<string, unknown> ?? null);
      setLoading(false);
    });
  }, []);

  if (loading) return <Skeleton className="h-64" />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Employer Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage listings, review candidates, and track campus hiring performance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Jobs" value={Number(data?.activeJobs ?? 0)} icon={Briefcase} />
        <StatCard title="Internships" value={Number(data?.activeInternships ?? 0)} icon={Briefcase} />
        <StatCard title="Applications" value={Number(data?.totalApplications ?? 0)} icon={Send} />
        <StatCard title="Pending Review" value={Number(data?.pendingReview ?? 0)} icon={Users} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Quick actions</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button variant="brand" asChild>
              <Link href="/admin/jobs/new">Post a job</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/employer/applications">Review applications</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/employer/jobs">Manage listings</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Your companies</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4" aria-hidden />
              {Number(data?.companies ?? 0)} company profile(s) linked to your account
            </p>
            <Button variant="link" className="mt-2 h-auto p-0" asChild>
              <Link href="/employer/company">Manage company</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
