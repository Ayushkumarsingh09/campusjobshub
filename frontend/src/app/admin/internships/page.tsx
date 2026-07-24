'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import type { Internship } from '@/types/api';
import { AdminPageHeader } from '@/components/admin/page-header';
import { DataTableAdmin } from '@/components/admin/data-table-admin';
import { StatusBadge } from '@/components/admin/status-badge';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminInternshipsPage() {
  const [items, setItems] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.internships.list({ page, limit: 20, search: search || undefined });
      setItems(res.data ?? []);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Internships" description="Manage internship listings" actionLabel="New Internship" actionHref="/admin/internships/new" />
      {error && <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
      <Input placeholder="Search…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="sm:max-w-xs" />
      <DataTableAdmin
        columns={[
          { key: 'title', header: 'Title', cell: (r) => r.title, sortable: true, sortValue: (r) => r.title },
          { key: 'company', header: 'Company', cell: (r) => r.company?.name ?? '—' },
          { key: 'ppo', header: 'PPO', cell: (r) => (r.ppoAvailable ? 'Yes' : 'No') },
          { key: 'status', header: 'Status', cell: (r) => <StatusBadge status={r.status} /> },
          { key: 'actions', header: '', cell: (r) => (
            <div className="flex justify-end gap-1">
              <Button variant="ghost" size="icon" asChild><Link href={`/admin/internships/${r.id}/edit`}><Pencil className="h-4 w-4" /></Link></Button>
              <Button variant="ghost" size="icon" onClick={() => setDeleteId(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          )},
        ]}
        data={items}
        keyExtractor={(r) => r.id}
        loading={loading}
        selectable
        selectedIds={selected}
        onSelectionChange={setSelected}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        bulkActions={
          <Button size="sm" variant="outline" onClick={async () => {
            await adminApi.internships.bulk('publish', Array.from(selected));
            setSelected(new Set());
            load();
          }}>Publish</Button>
        }
        emptyMessage="No internships found"
      />
      <ConfirmDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)} title="Delete internship?" description="This will soft-delete the listing." onConfirm={async () => { if (deleteId) { await adminApi.internships.delete(deleteId); setDeleteId(null); load(); } }} />
    </div>
  );
}
