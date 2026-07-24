'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Scan, Pencil } from 'lucide-react';
import { adminApi, type SeoPage } from '@/lib/admin-api';
import { AdminPageHeader } from '@/components/admin/page-header';
import { DataTableAdmin } from '@/components/admin/data-table-admin';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { calculateSeoScore } from '@/lib/seo-score';

export default function AdminSeoPage() {
  const [pages, setPages] = useState<SeoPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editPage, setEditPage] = useState<SeoPage | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.seo.list({ limit: 100 });
      setPages(res.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleScan() {
    setScanning(true);
    setError(null);
    try {
      const res = await adminApi.seo.scan();
      if (res.data?.pages) setPages(res.data.pages);
      else load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed');
    } finally {
      setScanning(false);
    }
  }

  async function saveEdit() {
    if (!editPage) return;
    setSaving(true);
    try {
      const score = calculateSeoScore({
        metaTitle: editPage.metaTitle,
        metaDescription: editPage.metaDescription,
        ogImage: editPage.ogImage,
        canonicalUrl: editPage.canonicalUrl,
      });
      await adminApi.seo.update(editPage.id, { ...editPage, seoScore: score });
      setEditPage(null);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  const avgScore = pages.length ? Math.round(pages.reduce((s, p) => s + p.seoScore, 0) / pages.length) : 0;

  return (
    <div className="space-y-6">
      <AdminPageHeader title="SEO Dashboard" description={`Average score: ${avgScore}/100 across ${pages.length} pages`}>
        <Button variant="brand" size="sm" onClick={handleScan} disabled={scanning}>
          {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Scan className="h-4 w-4" />}
          Scan Site
        </Button>
      </AdminPageHeader>
      {error && <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
      <DataTableAdmin
        columns={[
          { key: 'path', header: 'Path', cell: (r) => <code className="text-xs">{r.path}</code> },
          { key: 'title', header: 'Meta Title', cell: (r) => r.metaTitle ?? '—' },
          {
            key: 'score',
            header: 'Score',
            cell: (r) => (
              <span className={r.seoScore >= 70 ? 'text-emerald-400' : r.seoScore >= 40 ? 'text-amber-400' : 'text-red-400'}>
                {r.seoScore}
              </span>
            ),
            sortable: true,
            sortValue: (r) => r.seoScore,
          },
          { key: 'actions', header: '', cell: (r) => (
            <Button variant="ghost" size="icon" onClick={() => setEditPage(r)}><Pencil className="h-4 w-4" /></Button>
          )},
        ]}
        data={pages}
        keyExtractor={(r) => r.id}
        loading={loading}
        emptyMessage="No SEO pages. Run a scan to populate."
      />

      <Dialog open={!!editPage} onOpenChange={(o) => !o && setEditPage(null)}>
        <DialogContent className="border-zinc-800 bg-zinc-950 sm:max-w-lg">
          <DialogHeader><DialogTitle>Edit SEO — {editPage?.path}</DialogTitle></DialogHeader>
          {editPage && (
            <div className="space-y-4">
              <div className="space-y-2"><Label>Meta Title</Label><Input value={editPage.metaTitle ?? ''} onChange={(e) => setEditPage({ ...editPage, metaTitle: e.target.value })} /></div>
              <div className="space-y-2"><Label>Meta Description</Label><Textarea value={editPage.metaDescription ?? ''} onChange={(e) => setEditPage({ ...editPage, metaDescription: e.target.value })} rows={3} /></div>
              <div className="space-y-2"><Label>OG Image</Label><Input value={editPage.ogImage ?? ''} onChange={(e) => setEditPage({ ...editPage, ogImage: e.target.value })} /></div>
              <div className="space-y-2"><Label>Canonical URL</Label><Input value={editPage.canonicalUrl ?? ''} onChange={(e) => setEditPage({ ...editPage, canonicalUrl: e.target.value })} /></div>
              <label className="flex items-center gap-2 text-sm"><Checkbox checked={editPage.robotsIndex} onCheckedChange={(c) => setEditPage({ ...editPage, robotsIndex: !!c })} />Allow indexing</label>
              <Button variant="brand" onClick={saveEdit} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
