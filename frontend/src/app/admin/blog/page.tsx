'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import type { BlogPost } from '@/types/api';
import { AdminPageHeader } from '@/components/admin/page-header';
import { DataTableAdmin } from '@/components/admin/data-table-admin';
import { StatusBadge } from '@/components/admin/status-badge';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminBlogPage() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.blog.list({ page, limit: 20, search: search || undefined, status: status === 'all' ? undefined : status });
      setItems(res.data ?? []);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Blog" description="Manage blog posts" actionLabel="New Post" actionHref="/admin/blog/new" />
      {error && <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Search posts…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="sm:max-w-xs" />
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
          <SelectTrigger className="sm:w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DataTableAdmin
        columns={[
          { key: 'title', header: 'Title', cell: (r) => r.title, sortable: true, sortValue: (r) => r.title },
          { key: 'author', header: 'Author', cell: (r) => r.author?.name ?? '—' },
          { key: 'status', header: 'Status', cell: (r) => <StatusBadge status={r.status} /> },
          { key: 'views', header: 'Views', cell: (r) => r.viewCount },
          { key: 'actions', header: '', cell: (r) => (
            <div className="flex justify-end gap-1">
              <Button variant="ghost" size="icon" asChild><Link href={`/admin/blog/${r.id}/edit`}><Pencil className="h-4 w-4" /></Link></Button>
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
        emptyMessage="No blog posts found"
      />
      <ConfirmDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)} title="Delete post?" description="This will archive/delete the blog post." onConfirm={async () => { if (deleteId) { await adminApi.blog.delete(deleteId); setDeleteId(null); load(); } }} />
    </div>
  );
}
