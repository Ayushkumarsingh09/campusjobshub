'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { BadgeCheck, Pencil, Trash2 } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import type { Company } from '@/types/api';
import { AdminPageHeader } from '@/components/admin/page-header';
import { DataTableAdmin } from '@/components/admin/data-table-admin';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function AdminCompaniesPage() {
  const [items, setItems] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.companies.list({ page, limit: 20, search: search || undefined });
      setItems(res.data ?? []);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  async function verify(id: string) {
    try {
      await adminApi.companies.verify(id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verify failed');
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Companies" description="Manage company profiles" actionLabel="New Company" actionHref="/admin/companies/new" />
      {error && <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
      <Input placeholder="Search companies…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="sm:max-w-xs" />
      <DataTableAdmin
        columns={[
          { key: 'name', header: 'Name', cell: (r) => r.name, sortable: true, sortValue: (r) => r.name },
          { key: 'industry', header: 'Industry', cell: (r) => r.industry ?? '—' },
          { key: 'jobs', header: 'Jobs', cell: (r) => r.jobCount },
          { key: 'verified', header: 'Verified', cell: (r) => r.isVerified ? <Badge className="bg-emerald-500/20 text-emerald-400">Verified</Badge> : <Badge variant="outline">Unverified</Badge> },
          { key: 'actions', header: '', cell: (r) => (
            <div className="flex justify-end gap-1">
              {!r.isVerified && <Button variant="ghost" size="icon" onClick={() => verify(r.id)} title="Verify"><BadgeCheck className="h-4 w-4 text-emerald-400" /></Button>}
              <Button variant="ghost" size="icon" asChild><Link href={`/admin/companies/${r.id}/edit`}><Pencil className="h-4 w-4" /></Link></Button>
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
        emptyMessage="No companies found"
      />
      <ConfirmDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)} title="Delete company?" description="This will soft-delete the company." onConfirm={async () => { if (deleteId) { await adminApi.companies.delete(deleteId); setDeleteId(null); load(); } }} />
    </div>
  );
}
