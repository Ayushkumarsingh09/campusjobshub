import { api } from '@/lib/api';
import type { RelatedContentItem, RelatedContentType } from './types';

export async function fetchRelatedContent(
  type: RelatedContentType,
  slug: string,
  limit = 6
): Promise<RelatedContentItem[]> {
  try {
    const res = await api.get<RelatedContentItem[]>('/content/related', { type, slug, limit });
    return res.data ?? [];
  } catch {
    return [];
  }
}

export function relatedTypeLabel(type: RelatedContentType): string {
  const labels: Record<RelatedContentType, string> = {
    blog: 'Article',
    job: 'Job',
    internship: 'Internship',
    company: 'Company',
    roadmap: 'Roadmap',
    interview: 'Interview',
  };
  return labels[type];
}
