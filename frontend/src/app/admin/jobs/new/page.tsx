'use client';

import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/admin-api';
import { AdminPageHeader } from '@/components/admin/page-header';
import { JobForm } from '@/components/admin/forms/job-form';

export default function NewJobPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader title="New Job" description="Create a new job listing" />
      <JobForm
        submitLabel="Create Job"
        onSubmit={async (data) => {
          const res = await adminApi.jobs.create(data as Parameters<typeof adminApi.jobs.create>[0]);
          if (res.data) router.push(`/admin/jobs/${res.data.id}/edit`);
        }}
      />
    </div>
  );
}
