'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, Loader2 } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import type { Internship } from '@/types/api';
import { AdminPageHeader } from '@/components/admin/page-header';
import { InternshipForm } from '@/components/admin/forms/internship-form';
import { Button } from '@/components/ui/button';

export default function EditInternshipPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Internship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi.internships.get(id).then((res) => setItem(res.data ?? null)).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error || !item) return <div className="text-destructive">{error ?? 'Not found'}</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader title="Edit Internship" description={item.title}>
        {item.status === 'active' && (
          <Button variant="outline" size="sm" asChild><Link href={`/internships/${item.slug}`} target="_blank"><ExternalLink className="h-4 w-4" /> Preview</Link></Button>
        )}
      </AdminPageHeader>
      <InternshipForm initial={item} onSubmit={async (data) => { await adminApi.internships.update(id, data); }} />
    </div>
  );
}
