'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { adminApi, type SiteSettings } from '@/lib/admin-api';
import { AdminPageHeader } from '@/components/admin/page-header';
import { FormSection } from '@/components/admin/form-section';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    adminApi.settings.get()
      .then((res) => setSettings(res.data ?? {}))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await adminApi.settings.update(settings);
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
      <AdminPageHeader title="Site Settings" description="Logo, contact, social links, and footer" />

      {error && <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
      {success && <div className="rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">Settings saved successfully</div>}

      <FormSection title="Branding">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>Site Name</Label><Input value={settings.siteName ?? ''} onChange={(e) => setSettings((s) => ({ ...s, siteName: e.target.value }))} /></div>
          <div className="space-y-2"><Label>Tagline</Label><Input value={settings.tagline ?? ''} onChange={(e) => setSettings((s) => ({ ...s, tagline: e.target.value }))} /></div>
          <div className="space-y-2"><Label>Logo URL</Label><Input value={settings.logo ?? ''} onChange={(e) => setSettings((s) => ({ ...s, logo: e.target.value }))} /></div>
          <div className="space-y-2"><Label>Favicon URL</Label><Input value={settings.favicon ?? ''} onChange={(e) => setSettings((s) => ({ ...s, favicon: e.target.value }))} /></div>
        </div>
      </FormSection>

      <FormSection title="Contact">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>Email</Label><Input value={settings.contact?.email ?? ''} onChange={(e) => setSettings((s) => ({ ...s, contact: { ...s.contact, email: e.target.value } }))} /></div>
          <div className="space-y-2"><Label>Phone</Label><Input value={settings.contact?.phone ?? ''} onChange={(e) => setSettings((s) => ({ ...s, contact: { ...s.contact, phone: e.target.value } }))} /></div>
        </div>
        <div className="space-y-2"><Label>Address</Label><Textarea value={settings.contact?.address ?? ''} onChange={(e) => setSettings((s) => ({ ...s, contact: { ...s.contact, address: e.target.value } }))} rows={2} /></div>
      </FormSection>

      <FormSection title="Social Links">
        <div className="grid gap-4 sm:grid-cols-2">
          {(['twitter', 'linkedin', 'instagram', 'youtube'] as const).map((platform) => (
            <div key={platform} className="space-y-2">
              <Label className="capitalize">{platform}</Label>
              <Input
                value={settings.social?.[platform] ?? ''}
                onChange={(e) => setSettings((s) => ({ ...s, social: { ...s.social, [platform]: e.target.value } }))}
                placeholder={`https://${platform}.com/...`}
              />
            </div>
          ))}
        </div>
      </FormSection>

      <FormSection title="Footer">
        <div className="space-y-2">
          <Label>Copyright Text</Label>
          <Input value={settings.footer?.copyright ?? ''} onChange={(e) => setSettings((s) => ({ ...s, footer: { ...s.footer, copyright: e.target.value } }))} />
        </div>
      </FormSection>

      <Button variant="brand" onClick={handleSave} disabled={saving}>
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        Save Settings
      </Button>
    </div>
  );
}
