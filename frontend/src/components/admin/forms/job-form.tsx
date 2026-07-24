'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FormSection } from '@/components/admin/form-section';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { SeoFields } from '@/components/admin/seo-fields';
import { adminApi } from '@/lib/admin-api';
import type { Company, Job } from '@/types/api';

const jobSchema = z.object({
  title: z.string().min(3, 'Title required'),
  description: z.string().min(20, 'Description required'),
  companyId: z.string().uuid('Select a company'),
  locationCity: z.string().optional(),
  locationState: z.string().optional(),
  isRemote: z.boolean(),
  experienceMin: z.coerce.number().min(0),
  experienceMax: z.coerce.number().optional(),
  salaryMin: z.coerce.number().optional(),
  salaryMax: z.coerce.number().optional(),
  salaryDisclosed: z.boolean(),
  employmentType: z.enum(['full_time', 'part_time', 'contract', 'freelance', 'temporary']),
  skills: z.string(),
  applicationMethod: z.enum(['internal', 'external']),
  externalApplyUrl: z.string().optional(),
  status: z.enum(['draft', 'pending_review', 'active', 'closed', 'expired']),
  expiresAt: z.string().min(1, 'Expiry date required'),
  applicationDeadline: z.string().optional(),
  isFeatured: z.boolean(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImageUrl: z.string().optional(),
  canonicalUrl: z.string().optional(),
});

type JobFormValues = z.infer<typeof jobSchema>;

interface JobFormProps {
  initial?: Partial<Job>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  submitLabel?: string;
}

export function JobForm({ initial, onSubmit, submitLabel = 'Save Job' }: JobFormProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: initial?.title ?? '',
      description: initial?.description ?? '',
      companyId: initial?.companyId ?? '',
      locationCity: initial?.locationCity ?? '',
      locationState: initial?.locationState ?? '',
      isRemote: initial?.isRemote ?? false,
      experienceMin: initial?.experienceMin ?? 0,
      experienceMax: initial?.experienceMax ?? undefined,
      salaryMin: initial?.salaryMin ?? undefined,
      salaryMax: initial?.salaryMax ?? undefined,
      salaryDisclosed: initial?.salaryDisclosed ?? true,
      employmentType: initial?.employmentType ?? 'full_time',
      skills: initial?.skills?.join(', ') ?? '',
      applicationMethod: initial?.applicationMethod ?? 'internal',
      externalApplyUrl: initial?.externalApplyUrl ?? '',
      status: initial?.status ?? 'draft',
      expiresAt: initial?.expiresAt?.slice(0, 10) ?? '',
      applicationDeadline: initial?.applicationDeadline?.slice(0, 10) ?? '',
      isFeatured: initial?.isFeatured ?? false,
      metaTitle: initial?.metaTitle ?? '',
      metaDescription: initial?.metaDescription ?? '',
      ogImageUrl: initial?.ogImageUrl ?? '',
      canonicalUrl: initial?.canonicalUrl ?? '',
    },
  });

  useEffect(() => {
    adminApi.companies.list({ limit: 200 }).then((res) => setCompanies(res.data ?? []));
  }, []);

  async function handleSubmit(values: JobFormValues) {
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        ...values,
        skills: values.skills.split(',').map((s) => s.trim()).filter(Boolean),
        experienceMax: values.experienceMax || null,
        salaryMin: values.salaryMin || null,
        salaryMax: values.salaryMax || null,
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
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <FormSection title="Basic Info">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input {...form.register('title')} />
          {form.formState.errors.title && (
            <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Company</Label>
          <Select value={form.watch('companyId')} onValueChange={(v) => form.setValue('companyId', v)}>
            <SelectTrigger><SelectValue placeholder="Select company" /></SelectTrigger>
            <SelectContent>
              {companies.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <RichTextEditor value={description} onChange={(v) => form.setValue('description', v)} />
        </div>
        <div className="space-y-2">
          <Label>Skills (comma-separated)</Label>
          <Input {...form.register('skills')} placeholder="React, Node.js, SQL" />
        </div>
      </FormSection>

      <FormSection title="Location & Compensation">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>City</Label><Input {...form.register('locationCity')} /></div>
          <div className="space-y-2"><Label>State</Label><Input {...form.register('locationState')} /></div>
          <div className="space-y-2"><Label>Min Experience (yrs)</Label><Input type="number" {...form.register('experienceMin')} /></div>
          <div className="space-y-2"><Label>Max Experience (yrs)</Label><Input type="number" {...form.register('experienceMax')} /></div>
          <div className="space-y-2"><Label>Salary Min</Label><Input type="number" {...form.register('salaryMin')} /></div>
          <div className="space-y-2"><Label>Salary Max</Label><Input type="number" {...form.register('salaryMax')} /></div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={form.watch('isRemote')} onCheckedChange={(c) => form.setValue('isRemote', !!c)} />
          Remote position
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={form.watch('salaryDisclosed')} onCheckedChange={(c) => form.setValue('salaryDisclosed', !!c)} />
          Salary disclosed
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={form.watch('isFeatured')} onCheckedChange={(c) => form.setValue('isFeatured', !!c)} />
          Featured listing
        </label>
      </FormSection>

      <FormSection title="Application & Dates">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Employment Type</Label>
            <Select value={form.watch('employmentType')} onValueChange={(v) => form.setValue('employmentType', v as JobFormValues['employmentType'])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="full_time">Full Time</SelectItem>
                <SelectItem value="part_time">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
                <SelectItem value="temporary">Temporary</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.watch('status')} onValueChange={(v) => form.setValue('status', v as JobFormValues['status'])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending_review">Pending Review</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Expires At</Label><Input type="date" {...form.register('expiresAt')} /></div>
          <div className="space-y-2"><Label>Application Deadline</Label><Input type="date" {...form.register('applicationDeadline')} /></div>
        </div>
        <div className="space-y-2">
          <Label>External Apply URL</Label>
          <Input {...form.register('externalApplyUrl')} placeholder="https://" />
        </div>
      </FormSection>

      <FormSection title="SEO">
        <SeoFields
          values={{
            metaTitle: form.watch('metaTitle'),
            metaDescription: form.watch('metaDescription'),
            ogImageUrl: form.watch('ogImageUrl'),
            canonicalUrl: form.watch('canonicalUrl'),
          }}
          onChange={(field, value) => {
            if (field === 'metaTitle' || field === 'metaDescription' || field === 'ogImageUrl' || field === 'canonicalUrl') {
              form.setValue(field, value);
            }
          }}
          title={form.watch('title')}
          content={description}
        />
      </FormSection>

      <Button type="submit" variant="brand" disabled={saving}>
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
}
