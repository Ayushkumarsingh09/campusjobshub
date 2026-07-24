'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import type { CareerRoadmap } from '@/types/api';
import { AdminPageHeader } from '@/components/admin/page-header';
import { DataTableAdmin } from '@/components/admin/data-table-admin';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminRoadmapsPage() {
  const [items, setItems] = useState<CareerRoadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.roadmaps.list({ page, limit: 20 });
      setItems(res.data ?? []);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Roadmaps" description="Career preparation roadmaps" actionLabel="New Roadmap" actionHref="/admin/roadmaps/new" />
      {error && <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
      <DataTableAdmin
        columns={[
          { key: 'title', header: 'Title', cell: (r) => r.title, sortable: true, sortValue: (r) => r.title },
          { key: 'topic', header: 'Topic', cell: (r) => r.topic ?? '—' },
          { key: 'steps', header: 'Steps', cell: (r) => r.steps?.length ?? 0 },
          { key: 'published', header: 'Status', cell: (r) => r.isPublished ? <Badge className="bg-emerald-500/20 text-emerald-400">Published</Badge> : <Badge variant="outline">Draft</Badge> },
          { key: 'actions', header: '', cell: (r) => (
            <div className="flex justify-end gap-1">
              <Button variant="ghost" size="icon" asChild><Link href={`/admin/roadmaps/${r.id}/edit`}><Pencil className="h-4 w-4" /></Link></Button>
              <Button variant="ghost" size="icon" onClick={() => setDeleteId(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          )},
        ]}
        data={items}
        keyExtractor={(r) => r.id}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyMessage="No roadmaps found"
      />
      <ConfirmDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)} title="Delete roadmap?" description="This will permanently delete the roadmap and its steps." onConfirm={async () => { if (deleteId) { await adminApi.roadmaps.delete(deleteId); setDeleteId(null); load(); } }} />
    </div>
  );
}
