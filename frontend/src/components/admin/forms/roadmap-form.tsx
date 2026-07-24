'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowDown, ArrowUp, GripVertical, Loader2, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FormSection } from '@/components/admin/form-section';
import { SeoFields } from '@/components/admin/seo-fields';
import type { CareerRoadmap, RoadmapStep } from '@/types/api';

const stepSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional(),
  resourceUrl: z.string().optional(),
  resourceType: z.string().optional(),
  estimatedHours: z.coerce.number().optional(),
});

const schema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  estimatedHours: z.coerce.number().optional(),
  thumbnailUrl: z.string().optional(),
  topic: z.string().optional(),
  isPublished: z.boolean(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  steps: z.array(stepSchema),
});

type FormValues = z.infer<typeof schema>;

interface RoadmapFormProps {
  initial?: Partial<CareerRoadmap>;
  onSubmit: (data: Record<string, unknown>, steps: Partial<RoadmapStep>[]) => Promise<void>;
  submitLabel?: string;
}

export function RoadmapForm({ initial, onSubmit, submitLabel = 'Save Roadmap' }: RoadmapFormProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? '',
      description: initial?.description ?? '',
      difficulty: initial?.difficulty ?? 'medium',
      estimatedHours: initial?.estimatedHours ?? undefined,
      thumbnailUrl: initial?.thumbnailUrl ?? '',
      topic: initial?.topic ?? '',
      isPublished: initial?.isPublished ?? false,
      metaTitle: '',
      metaDescription: '',
      steps: initial?.steps?.map((s) => ({
        title: s.title,
        slug: s.slug,
        description: s.description ?? '',
        resourceUrl: s.resourceUrl ?? '',
        resourceType: s.resourceType ?? '',
        estimatedHours: s.estimatedHours ?? undefined,
      })) ?? [{ title: 'Step 1', description: '' }],
    },
  });

  const steps = useFieldArray({ control: form.control, name: 'steps' });

  function moveStep(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= steps.fields.length) return;
    steps.move(index, target);
  }

  async function handleSubmit(values: FormValues) {
    setSaving(true);
    setError(null);
    try {
      const stepPayload = values.steps.map((s, i) => ({
        ...s,
        stepOrder: i + 1,
        slug: s.slug || s.title.toLowerCase().replace(/\s+/g, '-').slice(0, 50),
      }));
      await onSubmit(
        {
          title: values.title,
          description: values.description,
          difficulty: values.difficulty,
          estimatedHours: values.estimatedHours || null,
          thumbnailUrl: values.thumbnailUrl || null,
          topic: values.topic || null,
          isPublished: values.isPublished,
          metaTitle: values.metaTitle,
          metaDescription: values.metaDescription,
        },
        stepPayload
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      {error && <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}

      <FormSection title="Roadmap Info">
        <div className="space-y-2"><Label>Title</Label><Input {...form.register('title')} /></div>
        <div className="space-y-2"><Label>Description</Label><Textarea rows={3} {...form.register('description')} /></div>
        <div className="grid gap-4 sm:grid-cols-2">
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
          <div className="space-y-2"><Label>Topic</Label><Input {...form.register('topic')} /></div>
          <div className="space-y-2"><Label>Est. Hours</Label><Input type="number" {...form.register('estimatedHours')} /></div>
          <div className="space-y-2"><Label>Thumbnail URL</Label><Input {...form.register('thumbnailUrl')} /></div>
        </div>
        <label className="flex items-center gap-2 text-sm"><Checkbox checked={form.watch('isPublished')} onCheckedChange={(c) => form.setValue('isPublished', !!c)} />Published</label>
      </FormSection>

      <FormSection title="Steps" description="Add, remove, and reorder roadmap steps">
        <div className="space-y-3">
          {steps.fields.map((field, index) => (
            <div key={field.id} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                  <GripVertical className="h-4 w-4 text-zinc-600" />
                  Step {index + 1}
                </div>
                <div className="flex gap-1">
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveStep(index, -1)} disabled={index === 0}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveStep(index, 1)} disabled={index === steps.fields.length - 1}>
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => steps.remove(index)} disabled={steps.fields.length <= 1}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Input placeholder="Step title" {...form.register(`steps.${index}.title`)} />
                <Textarea placeholder="Description" rows={2} {...form.register(`steps.${index}.description`)} />
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input placeholder="Resource URL" {...form.register(`steps.${index}.resourceUrl`)} />
                  <Input placeholder="Resource type" {...form.register(`steps.${index}.resourceType`)} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => steps.append({ title: `Step ${steps.fields.length + 1}`, description: '' })}>
          <Plus className="h-4 w-4" /> Add Step
        </Button>
      </FormSection>

      <FormSection title="SEO">
        <SeoFields
          values={{ metaTitle: form.watch('metaTitle'), metaDescription: form.watch('metaDescription') }}
          onChange={(f, v) => {
            if (f === 'metaTitle' || f === 'metaDescription') form.setValue(f, v);
          }}
          title={form.watch('title')}
          content={form.watch('description')}
        />
      </FormSection>

      <Button type="submit" variant="brand" disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin" />}{submitLabel}</Button>
    </form>
  );
}
