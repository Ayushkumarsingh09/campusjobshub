'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { adminApi, type AdSenseConfig } from '@/lib/admin-api';
import { AdminPageHeader } from '@/components/admin/page-header';
import { FormSection } from '@/components/admin/form-section';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

const PAGE_TYPES = [
  { key: 'home', label: 'Homepage' },
  { key: 'jobs', label: 'Jobs Listing' },
  { key: 'job_detail', label: 'Job Detail' },
  { key: 'internships', label: 'Internships Listing' },
  { key: 'internship_detail', label: 'Internship Detail' },
  { key: 'blog', label: 'Blog Listing' },
  { key: 'blog_post', label: 'Blog Post' },
  { key: 'companies', label: 'Companies' },
];

export default function AdminAdSensePage() {
  const [config, setConfig] = useState<AdSenseConfig>({ enabled: false, slots: {} });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    adminApi.settings.get()
      .then((res) => setConfig(res.data?.adsense ?? { enabled: false, slots: {} }))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  function updateSlot(key: string, patch: Partial<{ enabled: boolean; slotId?: string }>) {
    setConfig((prev) => ({
      ...prev,
      slots: {
        ...prev.slots,
        [key]: { ...prev.slots?.[key], enabled: prev.slots?.[key]?.enabled ?? false, ...patch },
      },
    }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await adminApi.settings.update({ adsense: config });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <AdminPageHeader title="AdSense" description="Configure ad slots per page type" />
      {error && <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
      {success && <div className="rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">Settings saved</div>}

      <FormSection title="Global Settings">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={config.enabled ?? false} onCheckedChange={(c) => setConfig((p) => ({ ...p, enabled: !!c }))} />
          Enable AdSense site-wide
        </label>
        <div className="space-y-2">
          <Label>Publisher ID</Label>
          <Input value={config.publisherId ?? ''} onChange={(e) => setConfig((p) => ({ ...p, publisherId: e.target.value }))} placeholder="ca-pub-xxxxxxxx" />
        </div>
      </FormSection>

      <FormSection title="Page Slots" description="Enable and configure ad slots for each page type">
        <div className="space-y-4">
          {PAGE_TYPES.map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-2 rounded-md border border-zinc-800 p-3 sm:flex-row sm:items-center">
              <label className="flex min-w-[160px] items-center gap-2 text-sm font-medium">
                <Checkbox checked={config.slots?.[key]?.enabled ?? false} onCheckedChange={(c) => updateSlot(key, { enabled: !!c })} />
                {label}
              </label>
              <Input
                className="flex-1"
                placeholder="Slot ID"
                value={config.slots?.[key]?.slotId ?? ''}
                onChange={(e) => updateSlot(key, { slotId: e.target.value })}
                disabled={!config.slots?.[key]?.enabled}
              />
            </div>
          ))}
        </div>
      </FormSection>

      <Button variant="brand" onClick={handleSave} disabled={saving}>
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        Save AdSense Config
      </Button>
    </div>
  );
}
