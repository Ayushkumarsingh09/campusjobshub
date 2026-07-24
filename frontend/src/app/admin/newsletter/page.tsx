'use client';

import { useCallback, useEffect, useState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import { adminApi, type NewsletterSubscriber } from '@/lib/admin-api';
import { AdminPageHeader } from '@/components/admin/page-header';
import { DataTableAdmin } from '@/components/admin/data-table-admin';
import { StatusBadge } from '@/components/admin/status-badge';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminNewsletterPage() {
  const [items, setItems] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.newsletter.list({ page, limit: 20, status: status === 'all' ? undefined : status });
      setItems(res.data ?? []);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => { load(); }, [load]);

  async function handleExport() {
    setExporting(true);
    try {
      const res = await adminApi.newsletter.export();
      const rows = res.data ?? [];
      const csv = ['email,status,createdAt', ...rows.map((r) => `${r.email},${r.status},${r.createdAt}`)].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'newsletter-subscribers.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Newsletter" description="Manage email subscribers">
        <Button variant="outline" size="sm" onClick={handleExport} disabled={exporting}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </AdminPageHeader>
      {error && <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
      <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
        <SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
          <SelectItem value="bounced">Bounced</SelectItem>
        </SelectContent>
      </Select>
      <DataTableAdmin
        columns={[
          { key: 'email', header: 'Email', cell: (r) => r.email },
          {
            key: 'status',
            header: 'Status',
            cell: (r) => (
              <Select value={r.status} onValueChange={async (v) => { await adminApi.newsletter.update(r.id, { status: v as NewsletterSubscriber['status'] }); load(); }}>
                <SelectTrigger className="h-8 w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                  <SelectItem value="bounced">Bounced</SelectItem>
                </SelectContent>
              </Select>
            ),
          },
          { key: 'source', header: 'Source', cell: (r) => r.source ?? '—' },
          { key: 'joined', header: 'Subscribed', cell: (r) => new Date(r.createdAt).toLocaleDateString() },
          { key: 'actions', header: '', cell: (r) => (
            <Button variant="ghost" size="icon" onClick={() => setDeleteId(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          )},
        ]}
        data={items}
        keyExtractor={(r) => r.id}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyMessage="No subscribers found"
      />
      <ConfirmDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)} title="Delete subscriber?" description="This will remove the subscriber record." onConfirm={async () => { if (deleteId) { await adminApi.newsletter.delete(deleteId); setDeleteId(null); load(); } }} />
    </div>
  );
}
