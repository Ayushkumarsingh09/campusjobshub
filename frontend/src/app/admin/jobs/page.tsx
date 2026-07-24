'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import type { Job } from '@/types/api';
import { AdminPageHeader } from '@/components/admin/page-header';
import { DataTableAdmin } from '@/components/admin/data-table-admin';
import { StatusBadge } from '@/components/admin/status-badge';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.jobs.list({
        page,
        limit: 20,
        search: search || undefined,
        status: status === 'all' ? undefined : status,
      });
      setJobs(res.data ?? []);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => { load(); }, [load]);

  async function handleBulk(action: 'publish' | 'delete') {
    if (selected.size === 0) return;
    setBulkLoading(true);
    try {
      await adminApi.jobs.bulk(action, Array.from(selected));
      setSelected(new Set());
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bulk action failed');
    } finally {
      setBulkLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await adminApi.jobs.delete(deleteId);
      setDeleteId(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Jobs" description="Manage job listings" actionLabel="New Job" actionHref="/admin/jobs/new" />

      {error && <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Search jobs…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="sm:max-w-xs" />
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
          <SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending_review">Pending</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTableAdmin
        columns={[
          { key: 'title', header: 'Title', cell: (r) => <span className="font-medium">{r.title}</span>, sortable: true, sortValue: (r) => r.title },
          { key: 'company', header: 'Company', cell: (r) => r.company?.name ?? '—' },
          { key: 'status', header: 'Status', cell: (r) => <StatusBadge status={r.status} /> },
          { key: 'views', header: 'Views', cell: (r) => r.viewCount, sortable: true, sortValue: (r) => r.viewCount },
          {
            key: 'actions',
            header: '',
            cell: (r) => (
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="icon" asChild><Link href={`/admin/jobs/${r.id}/edit`}><Pencil className="h-4 w-4" /></Link></Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleteId(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ),
          },
        ]}
        data={jobs}
        keyExtractor={(r) => r.id}
        loading={loading}
        selectable
        selectedIds={selected}
        onSelectionChange={setSelected}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        bulkActions={
          <>
            <Button size="sm" variant="outline" disabled={bulkLoading} onClick={() => handleBulk('publish')}>Publish</Button>
            <Button size="sm" variant="destructive" disabled={bulkLoading} onClick={() => handleBulk('delete')}>Delete</Button>
          </>
        }
        emptyMessage="No jobs found"
      />

      <ConfirmDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)} title="Delete job?" description="This will soft-delete the job listing." onConfirm={handleDelete} />
    </div>
  );
}
