'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, Loader2 } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import type { CareerRoadmap } from '@/types/api';
import { AdminPageHeader } from '@/components/admin/page-header';
import { RoadmapForm } from '@/components/admin/forms/roadmap-form';
import { Button } from '@/components/ui/button';

export default function EditRoadmapPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<CareerRoadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi.roadmaps.get(id).then((res) => setItem(res.data ?? null)).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error || !item) return <div className="text-destructive">{error ?? 'Not found'}</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader title="Edit Roadmap" description={item.title}>
        {item.isPublished && (
          <Button variant="outline" size="sm" asChild><Link href={`/prepare/roadmaps/${item.slug}`} target="_blank"><ExternalLink className="h-4 w-4" /> Preview</Link></Button>
        )}
      </AdminPageHeader>
      <RoadmapForm
        initial={item}
        onSubmit={async (data, steps) => {
          await adminApi.roadmaps.update(id, data);
          await adminApi.roadmaps.updateSteps(id, steps);
        }}
      />
    </div>
  );
}
