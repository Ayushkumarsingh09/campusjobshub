'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormSection } from '@/components/admin/form-section';
import { SeoFields } from '@/components/admin/seo-fields';
import type { Company } from '@/types/api';

const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  website: z.string().optional(),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  headquartersCity: z.string().optional(),
  headquartersState: z.string().optional(),
  careersPageUrl: z.string().optional(),
  hiringProcess: z.string().optional(),
  salaryInformation: z.string().optional(),
  interviewExperience: z.string().optional(),
  eligibilityCriteria: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImageUrl: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CompanyFormProps {
  initial?: Partial<Company>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  submitLabel?: string;
}

export function CompanyForm({ initial, onSubmit, submitLabel = 'Save Company' }: CompanyFormProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial?.name ?? '',
      description: initial?.description ?? '',
      logoUrl: initial?.logoUrl ?? '',
      website: initial?.website ?? '',
      industry: initial?.industry ?? '',
      companySize: initial?.companySize ?? '',
      headquartersCity: initial?.headquartersCity ?? '',
      headquartersState: initial?.headquartersState ?? '',
      careersPageUrl: '',
      hiringProcess: '',
      salaryInformation: '',
      interviewExperience: '',
      eligibilityCriteria: '',
      metaTitle: '',
      metaDescription: '',
      ogImageUrl: '',
    },
  });

  async function handleSubmit(values: FormValues) {
    setSaving(true);
    setError(null);
    try {
      await onSubmit({ ...values, companySize: values.companySize || null });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      {error && <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}

      <FormSection title="Company Profile">
        <div className="space-y-2"><Label>Name</Label><Input {...form.register('name')} /></div>
        <div className="space-y-2"><Label>Description</Label><Textarea rows={4} {...form.register('description')} /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>Logo URL</Label><Input {...form.register('logoUrl')} /></div>
          <div className="space-y-2"><Label>Website</Label><Input {...form.register('website')} /></div>
          <div className="space-y-2"><Label>Industry</Label><Input {...form.register('industry')} /></div>
          <div className="space-y-2">
            <Label>Company Size</Label>
            <Select value={form.watch('companySize')} onValueChange={(v) => form.setValue('companySize', v)}>
              <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
              <SelectContent>
                {['SIZE_1_10', 'SIZE_11_50', 'SIZE_51_200', 'SIZE_201_500', 'SIZE_501_1000', 'SIZE_1001_5000', 'SIZE_5000_PLUS'].map((s) => (
                  <SelectItem key={s} value={s}>{s.replace('SIZE_', '').replace('_', '-')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>HQ City</Label><Input {...form.register('headquartersCity')} /></div>
          <div className="space-y-2"><Label>HQ State</Label><Input {...form.register('headquartersState')} /></div>
        </div>
      </FormSection>

      <FormSection title="Hiring Info">
        <div className="space-y-2"><Label>Careers Page URL</Label><Input {...form.register('careersPageUrl')} /></div>
        <div className="space-y-2"><Label>Hiring Process</Label><Textarea rows={3} {...form.register('hiringProcess')} /></div>
        <div className="space-y-2"><Label>Salary Information</Label><Textarea rows={2} {...form.register('salaryInformation')} /></div>
        <div className="space-y-2"><Label>Interview Experience</Label><Textarea rows={3} {...form.register('interviewExperience')} /></div>
        <div className="space-y-2"><Label>Eligibility Criteria</Label><Textarea rows={2} {...form.register('eligibilityCriteria')} /></div>
      </FormSection>

      <FormSection title="SEO">
        <SeoFields
          values={{ metaTitle: form.watch('metaTitle'), metaDescription: form.watch('metaDescription'), ogImageUrl: form.watch('ogImageUrl') }}
          onChange={(f, v) => {
            if (f === 'metaTitle' || f === 'metaDescription' || f === 'ogImageUrl') form.setValue(f, v);
          }}
          title={form.watch('name')}
          content={form.watch('description')}
        />
      </FormSection>

      <Button type="submit" variant="brand" disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin" />}{submitLabel}</Button>
    </form>
  );
}
