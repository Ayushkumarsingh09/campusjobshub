'use client';

import { useCallback, useEffect, useState } from 'react';
import { ImagePlus, Loader2, Search, Trash2 } from 'lucide-react';
import { adminApi, type MediaAsset } from '@/lib/admin-api';
import { AdminPageHeader } from '@/components/admin/page-header';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';
import { EmptyAdmin } from '@/components/admin/empty-admin';

const CATEGORIES = ['general', 'blog', 'jobs', 'companies', 'avatars', 'banners'];

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.media.list({
        search: debouncedSearch || undefined,
        category: category === 'all' ? undefined : category,
        limit: 60,
      });
      setAssets(res.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category]);

  useEffect(() => { load(); }, [load]);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const sigRes = await adminApi.media.uploadSignature();
      const sig = sigRes.data;
      if (!sig) throw new Error('Upload signature unavailable');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', sig.apiKey);
      formData.append('timestamp', String(sig.timestamp));
      formData.append('signature', sig.signature);
      formData.append('folder', sig.folder);
      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, { method: 'POST', body: formData });
      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadJson.error?.message ?? 'Upload failed');
      await adminApi.media.create({
        publicId: uploadJson.public_id,
        url: uploadJson.url,
        secureUrl: uploadJson.secure_url,
        format: uploadJson.format,
        width: uploadJson.width,
        height: uploadJson.height,
        bytes: uploadJson.bytes,
        altText: file.name.replace(/\.[^.]+$/, ''),
        category: category === 'all' ? 'general' : category,
      });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Media Library" description="Upload and manage media assets">
        <label>
          <input type="file" accept="image/*" className="sr-only" disabled={uploading} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
          <Button variant="brand" size="sm" asChild><span>{uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />} Upload</span></Button>
        </label>
      </AdminPageHeader>
      {error && <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="sm:w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>
      ) : assets.length === 0 ? (
        <EmptyAdmin title="No media" description="Upload images to build your media library." actionLabel="Upload" onAction={() => document.querySelector<HTMLInputElement>('input[type=file]')?.click()} />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {assets.map((asset) => (
            <div key={asset.id} className="group relative overflow-hidden rounded-lg border border-zinc-800">
              <img src={asset.secureUrl} alt={asset.altText ?? ''} className="aspect-square w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-black/70 p-2">
                <p className="truncate text-xs text-white">{asset.altText ?? asset.publicId}</p>
                <p className="text-[10px] text-zinc-400 capitalize">{asset.category}</p>
              </div>
              <Button variant="destructive" size="icon" className="absolute right-2 top-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100" onClick={() => setDeleteId(asset.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)} title="Delete media?" description="This will remove the asset from the library." onConfirm={async () => { if (deleteId) { await adminApi.media.delete(deleteId); setDeleteId(null); load(); } }} />
    </div>
  );
}
