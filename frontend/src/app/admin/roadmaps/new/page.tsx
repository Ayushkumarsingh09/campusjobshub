'use client';

import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/admin-api';
import { AdminPageHeader } from '@/components/admin/page-header';
import { RoadmapForm } from '@/components/admin/forms/roadmap-form';

export default function NewRoadmapPage() {
  const router = useRouter();
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader title="New Roadmap" />
      <RoadmapForm onSubmit={async (data, steps) => {
        const res = await adminApi.roadmaps.create({ ...data, steps } as Parameters<typeof adminApi.roadmaps.create>[0]);
        if (res.data) {
          await adminApi.roadmaps.updateSteps(res.data.id, steps);
          router.push(`/admin/roadmaps/${res.data.id}/edit`);
        }
      }} />
    </div>
  );
}
