'use client';

import { useCallback, useEffect, useState } from 'react';
import { ImagePlus, Loader2, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { adminApi, type MediaAsset } from '@/lib/admin-api';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';

interface MediaPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (asset: MediaAsset) => void;
  category?: string;
}

export function MediaPicker({ open, onOpenChange, onSelect, category }: MediaPickerProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const loadAssets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.media.list({
        search: debouncedSearch || undefined,
        category: category || undefined,
        limit: 40,
      });
      setAssets(res.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load media');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category]);

  useEffect(() => {
    if (open) loadAssets();
  }, [open, loadAssets]);

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

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );
      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadJson.error?.message ?? 'Upload failed');

      const createRes = await adminApi.media.create({
        publicId: uploadJson.public_id,
        url: uploadJson.url,
        secureUrl: uploadJson.secure_url,
        format: uploadJson.format,
        width: uploadJson.width,
        height: uploadJson.height,
        bytes: uploadJson.bytes,
        altText: file.name.replace(/\.[^.]+$/, ''),
        category: category ?? 'general',
      });

      if (createRes.data) {
        setAssets((prev) => [createRes.data!, ...prev]);
        onSelect(createRes.data);
        onOpenChange(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-hidden border-zinc-800 bg-zinc-950 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search media…"
              className="pl-9"
            />
          </div>
          <label>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />
            <Button variant="outline" disabled={uploading} asChild>
              <span>
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ImagePlus className="h-4 w-4" />
                )}
                Upload
              </span>
            </Button>
          </label>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="max-h-[50vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : assets.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No media found</p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {assets.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => {
                    onSelect(asset);
                    onOpenChange(false);
                  }}
                  className={cn(
                    'group relative aspect-square overflow-hidden rounded-md border border-zinc-800 transition-colors hover:border-brand-500'
                  )}
                >
                  <img
                    src={asset.secureUrl}
                    alt={asset.altText ?? ''}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute inset-x-0 bottom-0 truncate bg-black/60 px-1 py-0.5 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {asset.altText ?? asset.publicId}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
