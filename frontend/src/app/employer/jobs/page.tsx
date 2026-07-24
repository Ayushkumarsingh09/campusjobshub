'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { careerApi } from '@/lib/career-api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function EmployerJobsPage() {
  const [data, setData] = useState<{ jobs: Array<{ id: string; title: string; slug: string; status: string; _count: { applications: number } }>; internships: Array<{ id: string; title: string; slug: string; status: string; _count: { applications: number } }> } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    careerApi.getEmployerJobs().then((res) => {
      setData(res.data as typeof data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Skeleton className="h-64" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Manage Listings</h1>
        <Button variant="brand" asChild>
          <Link href="/admin/jobs/new">Post new job</Link>
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold">Jobs</h2>
        {(data?.jobs ?? []).map((job) => (
          <Card key={job.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <Link href={`/jobs/${job.slug}`} className="font-medium hover:text-primary">{job.title}</Link>
                <p className="text-xs text-muted-foreground">{job._count.applications} applications</p>
              </div>
              <Badge>{job.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold">Internships</h2>
        {(data?.internships ?? []).map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <Link href={`/internships/${item.slug}`} className="font-medium hover:text-primary">{item.title}</Link>
                <p className="text-xs text-muted-foreground">{item._count.applications} applications</p>
              </div>
              <Badge>{item.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
