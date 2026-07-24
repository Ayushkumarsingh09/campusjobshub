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
import type { Company, InterviewQuestion } from '@/types/api';

const schema = z.object({
  question: z.string().min(5),
  answer: z.string().min(10),
  companyId: z.string().optional(),
  role: z.string().optional(),
  topic: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  isPublished: z.boolean(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface InterviewFormProps {
  initial?: Partial<InterviewQuestion>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  submitLabel?: string;
}

export function InterviewForm({ initial, onSubmit, submitLabel = 'Save Question' }: InterviewFormProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      question: initial?.question ?? '',
      answer: initial?.answer ?? '',
      companyId: initial?.companyId ?? '',
      role: initial?.role ?? '',
      topic: initial?.topic ?? '',
      difficulty: initial?.difficulty ?? 'medium',
      isPublished: initial?.isPublished ?? true,
      metaTitle: '',
      metaDescription: '',
    },
  });

  useEffect(() => {
    adminApi.companies.list({ limit: 200 }).then((res) => setCompanies(res.data ?? []));
  }, []);

  async function handleSubmit(values: FormValues) {
    setSaving(true);
    setError(null);
    try {
      await onSubmit({ ...values, companyId: values.companyId || null });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  const answer = form.watch('answer');

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      {error && <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}

      <FormSection title="Question">
        <div className="space-y-2"><Label>Question</Label><Textarea rows={2} {...form.register('question')} /></div>
        <div className="space-y-2"><Label>Answer</Label><RichTextEditor value={answer} onChange={(v) => form.setValue('answer', v)} /></div>
      </FormSection>

      <FormSection title="Classification">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Topic</Label>
            <Input {...form.register('topic')} placeholder="e.g. DSA, HR, System Design" />
          </div>
          <div className="space-y-2">
            <Label>Difficulty</Label>
            <Select value={form.watch('difficulty')} onValueChange={(v) => form.setValue('difficulty', v as FormValues['difficulty'])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Company</Label>
            <Select value={form.watch('companyId')} onValueChange={(v) => form.setValue('companyId', v)}>
              <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {companies.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Role</Label><Input {...form.register('role')} /></div>
        </div>
        <label className="flex items-center gap-2 text-sm"><Checkbox checked={form.watch('isPublished')} onCheckedChange={(c) => form.setValue('isPublished', !!c)} />Published</label>
      </FormSection>

      <FormSection title="SEO">
        <SeoFields
          values={{ metaTitle: form.watch('metaTitle'), metaDescription: form.watch('metaDescription') }}
          onChange={(f, v) => {
            if (f === 'metaTitle' || f === 'metaDescription') form.setValue(f, v);
          }}
          title={form.watch('question')}
          content={answer}
        />
      </FormSection>

      <Button type="submit" variant="brand" disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin" />}{submitLabel}</Button>
    </form>
  );
}
