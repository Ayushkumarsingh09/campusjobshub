'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FormSection } from '@/components/admin/form-section';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { SeoFields } from '@/components/admin/seo-fields';
import { MediaPicker } from '@/components/admin/media-picker';
import { adminApi, type FaqItem } from '@/lib/admin-api';
import type { BlogPost, Category, Tag } from '@/types/api';

const schema = z.object({
  title: z.string().min(3),
  excerpt: z.string().optional(),
  content: z.string().min(20),
  featuredImageUrl: z.string().optional(),
  categoryId: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  scheduledAt: z.string().optional(),
  isFeatured: z.boolean(),
  tagIds: z.array(z.string()),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImageUrl: z.string().optional(),
  canonicalUrl: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface BlogFormProps {
  initial?: Partial<BlogPost> & { faq?: FaqItem[] };
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  submitLabel?: string;
}

export function BlogForm({ initial, onSubmit, submitLabel = 'Save Post' }: BlogFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? '',
      excerpt: initial?.excerpt ?? '',
      content: initial?.content ?? '',
      featuredImageUrl: initial?.featuredImageUrl ?? '',
      categoryId: initial?.categoryId ?? '',
      status: initial?.status ?? 'draft',
      scheduledAt: '',
      isFeatured: false,
      tagIds: initial?.tags?.map((t) => t.tag.id) ?? [],
      faq: initial?.faq ?? [],
      metaTitle: initial?.metaTitle ?? '',
      metaDescription: initial?.metaDescription ?? '',
      ogImageUrl: '',
      canonicalUrl: '',
    },
  });

  const faqFields = useFieldArray({ control: form.control, name: 'faq' });

  useEffect(() => {
    Promise.all([
      adminApi.categories.list({ type: 'blog' }),
      adminApi.tags.list({ limit: 100 }),
    ]).then(([catRes, tagRes]) => {
      setCategories(catRes.data ?? []);
      setTags(tagRes.data ?? []);
    });
  }, []);

  async function handleSubmit(values: FormValues) {
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        ...values,
        categoryId: values.categoryId || null,
        scheduledAt: values.scheduledAt || null,
        featuredImageUrl: values.featuredImageUrl || null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  const content = form.watch('content');

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      {error && <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}

      <FormSection title="Post Content">
        <div className="space-y-2"><Label>Title</Label><Input {...form.register('title')} /></div>
        <div className="space-y-2"><Label>Excerpt</Label><Textarea rows={2} {...form.register('excerpt')} /></div>
        <div className="space-y-2"><Label>Content</Label><RichTextEditor value={content} onChange={(v) => form.setValue('content', v)} minHeight="280px" /></div>
        <div className="space-y-2">
          <Label>Featured Image</Label>
          <div className="flex gap-2">
            <Input {...form.register('featuredImageUrl')} placeholder="Image URL" />
            <Button type="button" variant="outline" onClick={() => setMediaOpen(true)}>Pick</Button>
          </div>
          {form.watch('featuredImageUrl') && (
            <img src={form.watch('featuredImageUrl')} alt="" className="mt-2 h-24 rounded-md object-cover" />
          )}
        </div>
      </FormSection>

      <FormSection title="Taxonomy">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={form.watch('categoryId')} onValueChange={(v) => form.setValue('categoryId', v)}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.watch('status')} onValueChange={(v) => form.setValue('status', v as FormValues['status'])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const selected = form.watch('tagIds').includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => {
                    const current = form.getValues('tagIds');
                    form.setValue('tagIds', selected ? current.filter((id) => id !== tag.id) : [...current, tag.id]);
                  }}
                  className={`rounded-full border px-3 py-1 text-xs ${selected ? 'border-brand-500 bg-brand-500/20 text-brand-400' : 'border-zinc-700 text-zinc-400'}`}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm"><Checkbox checked={form.watch('isFeatured')} onCheckedChange={(c) => form.setValue('isFeatured', !!c)} />Featured post</label>
      </FormSection>

      <FormSection title="FAQ Section">
        {faqFields.fields.map((field, index) => (
          <div key={field.id} className="space-y-2 rounded-md border border-zinc-800 p-3">
            <Input placeholder="Question" {...form.register(`faq.${index}.question`)} />
            <Textarea placeholder="Answer" rows={2} {...form.register(`faq.${index}.answer`)} />
            <Button type="button" variant="ghost" size="sm" onClick={() => faqFields.remove(index)}>
              <Trash2 className="h-4 w-4" /> Remove
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => faqFields.append({ question: '', answer: '' })}>
          <Plus className="h-4 w-4" /> Add FAQ
        </Button>
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
          content={content}
        />
      </FormSection>

      <Button type="submit" variant="brand" disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin" />}{submitLabel}</Button>

      <MediaPicker
        open={mediaOpen}
        onOpenChange={setMediaOpen}
        category="blog"
        onSelect={(asset) => form.setValue('featuredImageUrl', asset.secureUrl)}
      />
    </form>
  );
}
