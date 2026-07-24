import type { InternalLink } from './types';

const DEFAULT_HUB_LINKS: InternalLink[] = [
  { title: 'Campus Jobs', href: '/jobs' },
  { title: 'Internships', href: '/internships' },
  { title: 'Interview Questions', href: '/prepare/interview-questions' },
  { title: 'Career Roadmaps', href: '/prepare/roadmaps' },
  { title: 'Placement Blog', href: '/blog' },
];

export function mergeInternalLinks(
  custom: InternalLink[] | null | undefined,
  max = 8
): InternalLink[] {
  const seen = new Set<string>();
  const merged: InternalLink[] = [];

  for (const link of [...(custom ?? []), ...DEFAULT_HUB_LINKS]) {
    if (seen.has(link.href) || merged.length >= max) continue;
    seen.add(link.href);
    merged.push(link);
  }

  return merged;
}

export function parseInternalLinks(raw: unknown): InternalLink[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is InternalLink => {
      return (
        typeof item === 'object' &&
        item !== null &&
        'title' in item &&
        'href' in item &&
        typeof (item as InternalLink).title === 'string' &&
        typeof (item as InternalLink).href === 'string'
      );
    })
    .map((item) => ({
      title: item.title,
      href: item.href,
      anchor: item.anchor,
    }));
}
