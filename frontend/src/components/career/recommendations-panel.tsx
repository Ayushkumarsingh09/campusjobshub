'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { careerApi } from '@/lib/career-api';
import type { CareerRecommendations } from '@/types/career';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export function RecommendationsPanel() {
  const [data, setData] = useState<CareerRecommendations | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    careerApi.getRecommendations().then((res) => {
      setData(res.data ?? null);
      setLoading(false);
    });
  }, []);

  if (loading) return <Skeleton className="h-96" />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Career Recommendations</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Personalized careers, jobs, roadmaps, and skills based on your profile.
        </p>
      </div>

      <Card>
        <CardHeader><CardTitle>Recommended careers</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {data?.recommendedCareers.map((c) => (
            <div key={c.role} className="flex justify-between items-center rounded-lg border p-3">
              <div>
                <p className="font-medium">{c.role}</p>
                <p className="text-xs text-muted-foreground">{c.reason}</p>
              </div>
              <Badge>{c.matchPercent}%</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recommended jobs</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {data?.recommendedJobs.map((job) => (
            <Link key={job.id} href={`/jobs/${job.slug}`} className="flex justify-between items-center rounded-lg border p-3 hover:bg-muted/50">
              <div>
                <p className="font-medium">{job.title}</p>
                <p className="text-xs text-muted-foreground">{job.company?.name}</p>
              </div>
              <Badge variant="secondary">{job.matchPercent}% match</Badge>
            </Link>
          ))}
          {!data?.recommendedJobs.length && (
            <p className="text-sm text-muted-foreground">Add skills to your profile for job matches.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recommended roadmaps</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {data?.recommendedRoadmaps.map((r) => (
            <Link key={r.slug} href={`/prepare/roadmaps/${r.slug}`} className="flex justify-between items-center rounded-lg border p-3 hover:bg-muted/50">
              <p className="font-medium">{r.title}</p>
              <Badge variant="outline">{r.matchPercent}%</Badge>
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Skills to learn next</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {data?.recommendedSkills.map((s) => (
              <Badge key={s} variant="secondary">{s}</Badge>
            ))}
            {!data?.recommendedSkills.length && (
              <p className="text-sm text-muted-foreground">Your skills align well with your target role.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
