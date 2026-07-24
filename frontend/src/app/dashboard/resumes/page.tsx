'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Plus } from 'lucide-react';
import { careerApi } from '@/lib/career-api';
import type { Resume } from '@/types/career';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { timeAgo } from '@/lib/utils';

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    careerApi.listResumes().then((res) => {
      setResumes(res.data ?? []);
      setLoading(false);
    });
  }, []);

  const createNew = async () => {
    const res = await careerApi.createResume({ title: 'My Resume' });
    if (res.data) window.location.href = '/resume/builder';
  };

  if (loading) return <Skeleton className="h-64" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Resumes</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage resume versions and drafts.</p>
        </div>
        <Button variant="brand" className="gap-2" onClick={createNew}>
          <Plus className="h-4 w-4" aria-hidden />
          New resume
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {resumes.map((r) => (
          <Card key={r.id}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <FileText className="h-8 w-8 text-brand-600 shrink-0" aria-hidden />
                <div className="flex-1">
                  <p className="font-semibold">{r.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    v{r.version} · Updated {timeAgo(r.updatedAt)}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={r.status === 'published' ? 'default' : 'secondary'}>{r.status}</Badge>
                    {r.isPrimary && <Badge variant="outline">Primary</Badge>}
                  </div>
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full" asChild>
                <Link href="/resume/builder">Edit in builder</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {!resumes.length && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No resumes yet. Create your first ATS-friendly resume.</p>
            <Button variant="brand" className="mt-4" onClick={createNew}>Create resume</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
