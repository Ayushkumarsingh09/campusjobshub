'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, Loader2 } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import type { Job } from '@/types/api';
import { AdminPageHeader } from '@/components/admin/page-header';
import { JobForm } from '@/components/admin/forms/job-form';
import { Button } from '@/components/ui/button';

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi.jobs.get(id)
      .then((res) => setJob(res.data ?? null))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  if (error || !job) {
    return <div className="text-destructive">{error ?? 'Job not found'}</div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader title="Edit Job" description={job.title}>
        {job.status === 'active' && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/jobs/${job.slug}`} target="_blank"><ExternalLink className="h-4 w-4" /> Preview</Link>
          </Button>
        )}
      </AdminPageHeader>
      <JobForm
        initial={job}
        submitLabel="Update Job"
        onSubmit={async (data) => { await adminApi.jobs.update(id, data); }}
      />
    </div>
  );
}
