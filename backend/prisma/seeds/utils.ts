import type { PrismaClient } from '@prisma/client';

/** Editor account used as author for seeded CMS content */
export const AUTHOR = {
  email: 'editor@campusjobshub.com',
  name: 'Content Editor',
  role: 'editor',
} as const;

export type SeedContext = {
  prisma: PrismaClient;
  /** Resolved editor user id for blog authorship */
  authorId: string;
  /** Resolved employer user id for company ownership */
  employerId: string;
  categoryIds: Map<string, string>;
  tagIds: Map<string, string>;
  companyIds: Map<string, string>;
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function randomPick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}
