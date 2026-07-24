'use client';

import { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { calculateSeoScore } from '@/lib/seo-score';
import { cn } from '@/lib/utils';

export interface SeoFieldValues {
  metaTitle?: string;
  metaDescription?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;
}

interface SeoFieldsProps {
  values: SeoFieldValues;
  onChange: (field: keyof SeoFieldValues, value: string) => void;
  content?: string;
  title?: string;
  className?: string;
}

export function SeoFields({ values, onChange, content, title, className }: SeoFieldsProps) {
  const score = useMemo(
    () =>
      calculateSeoScore({
        metaTitle: values.metaTitle,
        metaDescription: values.metaDescription,
        title,
        content,
        ogImage: values.ogImageUrl,
        canonicalUrl: values.canonicalUrl,
      }),
    [values, content, title]
  );

  const scoreColor =
    score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-900/50 px-4 py-3">
        <span className="text-sm font-medium text-zinc-300">SEO Score</span>
        <span className={cn('text-2xl font-bold', scoreColor)}>{score}/100</span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="metaTitle">Meta Title</Label>
        <Input
          id="metaTitle"
          value={values.metaTitle ?? ''}
          onChange={(e) => onChange('metaTitle', e.target.value)}
          placeholder="30–60 characters recommended"
          maxLength={70}
        />
        <p className="text-xs text-zinc-500">{(values.metaTitle ?? '').length}/70 characters</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="metaDescription">Meta Description</Label>
        <Textarea
          id="metaDescription"
          value={values.metaDescription ?? ''}
          onChange={(e) => onChange('metaDescription', e.target.value)}
          placeholder="120–160 characters recommended"
          maxLength={160}
          rows={3}
        />
        <p className="text-xs text-zinc-500">
          {(values.metaDescription ?? '').length}/160 characters
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ogImageUrl">OG Image URL</Label>
        <Input
          id="ogImageUrl"
          value={values.ogImageUrl ?? ''}
          onChange={(e) => onChange('ogImageUrl', e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="canonicalUrl">Canonical URL</Label>
        <Input
          id="canonicalUrl"
          value={values.canonicalUrl ?? ''}
          onChange={(e) => onChange('canonicalUrl', e.target.value)}
          placeholder="https://campusjobshub.com/..."
        />
      </div>
    </div>
  );
}
