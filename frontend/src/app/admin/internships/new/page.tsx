'use client';

import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/admin-api';
import { AdminPageHeader } from '@/components/admin/page-header';
import { InternshipForm } from '@/components/admin/forms/internship-form';

export default function NewInternshipPage() {
  const router = useRouter();
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader title="New Internship" />
      <InternshipForm
        onSubmit={async (data) => {
          const res = await adminApi.internships.create(data as Parameters<typeof adminApi.internships.create>[0]);
          if (res.data) router.push(`/admin/internships/${res.data.id}/edit`);
        }}
      />
    </div>
  );
}
