'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FormSection } from '@/components/admin/form-section';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { SeoFields } from '@/components/admin/seo-fields';
import { adminApi } from '@/lib/admin-api';
import type { Company, Internship } from '@/types/api';

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(20),
  companyId: z.string().uuid(),
  locationCity: z.string().optional(),
  locationState: z.string().optional(),
  isRemote: z.boolean(),
  durationMonths: z.coerce.number().optional(),
  stipendMin: z.coerce.number().optional(),
  stipendMax: z.coerce.number().optional(),
  isPaid: z.boolean(),
  ppoAvailable: z.boolean(),
  startDate: z.string().optional(),
  skills: z.string(),
  applicationMethod: z.enum(['internal', 'external']),
  externalApplyUrl: z.string().optional(),
  status: z.enum(['draft', 'pending_review', 'active', 'closed', 'expired']),
  expiresAt: z.string().min(1),
  applicationDeadline: z.string().optional(),
  isFeatured: z.boolean(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImageUrl: z.string().optional(),
  canonicalUrl: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface InternshipFormProps {
  initial?: Partial<Internship>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  submitLabel?: string;
}

export function InternshipForm({ initial, onSubmit, submitLabel = 'Save Internship' }: InternshipFormProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? '',
      description: initial?.description ?? '',
      companyId: initial?.companyId ?? '',
      locationCity: initial?.locationCity ?? '',
      locationState: initial?.locationState ?? '',
      isRemote: initial?.isRemote ?? false,
      durationMonths: initial?.durationMonths ?? undefined,
      stipendMin: initial?.stipendMin ?? undefined,
      stipendMax: initial?.stipendMax ?? undefined,
      isPaid: initial?.isPaid ?? true,
      ppoAvailable: initial?.ppoAvailable ?? false,
      startDate: initial?.startDate?.slice(0, 10) ?? '',
      skills: initial?.skills?.join(', ') ?? '',
      applicationMethod: initial?.applicationMethod ?? 'internal',
      externalApplyUrl: initial?.externalApplyUrl ?? '',
      status: initial?.status ?? 'draft',
      expiresAt: initial?.expiresAt?.slice(0, 10) ?? '',
      applicationDeadline: '',
      isFeatured: false,
      metaTitle: initial?.metaTitle ?? '',
      metaDescription: initial?.metaDescription ?? '',
      ogImageUrl: '',
      canonicalUrl: '',
    },
  });

  useEffect(() => {
    adminApi.companies.list({ limit: 200 }).then((res) => setCompanies(res.data ?? []));
  }, []);

  async function handleSubmit(values: FormValues) {
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        ...values,
        skills: values.skills.split(',').map((s) => s.trim()).filter(Boolean),
        startDate: values.startDate || null,
        applicationDeadline: values.applicationDeadline || null,
        externalApplyUrl: values.externalApplyUrl || null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  const description = form.watch('description');

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      {error && <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}

      <FormSection title="Basic Info">
        <div className="space-y-2"><Label>Title</Label><Input {...form.register('title')} /></div>
        <div className="space-y-2">
          <Label>Company</Label>
          <Select value={form.watch('companyId')} onValueChange={(v) => form.setValue('companyId', v)}>
            <SelectTrigger><SelectValue placeholder="Select company" /></SelectTrigger>
            <SelectContent>{companies.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>Description</Label><RichTextEditor value={description} onChange={(v) => form.setValue('description', v)} /></div>
        <div className="space-y-2"><Label>Skills</Label><Input {...form.register('skills')} /></div>
      </FormSection>

      <FormSection title="Internship Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>Duration (months)</Label><Input type="number" {...form.register('durationMonths')} /></div>
          <div className="space-y-2"><Label>Start Date</Label><Input type="date" {...form.register('startDate')} /></div>
          <div className="space-y-2"><Label>Stipend Min</Label><Input type="number" {...form.register('stipendMin')} /></div>
          <div className="space-y-2"><Label>Stipend Max</Label><Input type="number" {...form.register('stipendMax')} /></div>
          <div className="space-y-2"><Label>Expires At</Label><Input type="date" {...form.register('expiresAt')} /></div>
          <div className="space-y-2"><Label>Deadline</Label><Input type="date" {...form.register('applicationDeadline')} /></div>
        </div>
        <label className="flex items-center gap-2 text-sm"><Checkbox checked={form.watch('isPaid')} onCheckedChange={(c) => form.setValue('isPaid', !!c)} />Paid</label>
        <label className="flex items-center gap-2 text-sm"><Checkbox checked={form.watch('ppoAvailable')} onCheckedChange={(c) => form.setValue('ppoAvailable', !!c)} />PPO Available</label>
        <label className="flex items-center gap-2 text-sm"><Checkbox checked={form.watch('isRemote')} onCheckedChange={(c) => form.setValue('isRemote', !!c)} />Remote</label>
        <label className="flex items-center gap-2 text-sm"><Checkbox checked={form.watch('isFeatured')} onCheckedChange={(c) => form.setValue('isFeatured', !!c)} />Featured</label>
      </FormSection>

      <FormSection title="SEO">
        <SeoFields
          values={{ metaTitle: form.watch('metaTitle'), metaDescription: form.watch('metaDescription'), ogImageUrl: form.watch('ogImageUrl'), canonicalUrl: form.watch('canonicalUrl') }}
          onChange={(f, v) => {
            if (f === 'metaTitle' || f === 'metaDescription' || f === 'ogImageUrl' || f === 'canonicalUrl') {
              form.setValue(f, v);
            }
          }}
          title={form.watch('title')}
          content={description}
        />
      </FormSection>

      <Button type="submit" variant="brand" disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin" />}{submitLabel}</Button>
    </form>
  );
}
