import type { CategoryType } from '@prisma/client';
import { BLOG_TAGS } from './data/constants';
import type { SeedContext } from './utils';

const CATEGORIES: {
  slug: string;
  name: string;
  description: string;
  type: CategoryType;
  sortOrder: number;
}[] = [
  {
    slug: 'software-engineering',
    name: 'Software Engineering',
    description: 'Campus and fresher roles in software development, full stack, backend, and platform engineering.',
    type: 'job',
    sortOrder: 1,
  },
  {
    slug: 'data-science',
    name: 'Data Science & AI',
    description: 'Data science, machine learning, analytics, and AI engineering opportunities for graduates.',
    type: 'job',
    sortOrder: 2,
  },
  {
    slug: 'company-guides',
    name: 'Company Hiring Guides',
    description: 'In-depth campus recruitment guides for top employers hiring Indian engineering graduates.',
    type: 'blog',
    sortOrder: 10,
  },
  {
    slug: 'career-guides',
    name: 'Career Guides',
    description: 'Resume, interview, salary, and career planning articles for campus and early-career professionals.',
    type: 'blog',
    sortOrder: 11,
  },
  {
    slug: 'placement-prep',
    name: 'Placement Preparation',
    description: 'Structured guides for aptitude, DSA, HR rounds, and full placement season preparation.',
    type: 'blog',
    sortOrder: 12,
  },
  {
    slug: 'interview-articles',
    name: 'Interview Articles',
    description: 'Technical and HR interview tips, question patterns, and round-wise preparation strategies.',
    type: 'blog',
    sortOrder: 13,
  },
];

export async function seedCategories(
  ctx: Pick<SeedContext, 'prisma'>
): Promise<{ categoryIds: Map<string, string>; tagIds: Map<string, string> }> {
  const categoryIds = new Map<string, string>();
  const tagIds = new Map<string, string>();

  for (const category of CATEGORIES) {
    const record = await ctx.prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        type: category.type,
        sortOrder: category.sortOrder,
      },
      create: category,
    });
    categoryIds.set(category.slug, record.id);
  }

  for (const tag of BLOG_TAGS) {
    const record = await ctx.prisma.tag.upsert({
      where: { slug: tag.slug },
      update: { name: tag.name },
      create: { slug: tag.slug, name: tag.name },
    });
    tagIds.set(tag.slug, record.id);
  }

  return { categoryIds, tagIds };
}
