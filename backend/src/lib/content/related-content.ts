import type { PrismaClient } from '@prisma/client';

export type RelatedContentType =
  | 'blog'
  | 'job'
  | 'internship'
  | 'company'
  | 'roadmap'
  | 'interview';

export interface RelatedItem {
  type: RelatedContentType;
  title: string;
  href: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  meta?: string | null;
  score: number;
}

function hrefFor(type: RelatedContentType, slug: string): string {
  switch (type) {
    case 'blog':
      return `/blog/${slug}`;
    case 'job':
      return `/jobs/${slug}`;
    case 'internship':
      return `/internships/${slug}`;
    case 'company':
      return `/companies/${slug}`;
    case 'roadmap':
      return `/prepare/roadmaps/${slug}`;
    case 'interview':
      return `/prepare/interview-questions?topic=${encodeURIComponent(slug)}`;
    default:
      return '/';
  }
}

function overlapScore(a: string[], b: string[]): number {
  if (!a.length || !b.length) return 0;
  const setB = new Set(b.map((s) => s.toLowerCase()));
  return a.filter((s) => setB.has(s.toLowerCase())).length;
}

export async function getRelatedContent(
  prisma: PrismaClient,
  type: RelatedContentType,
  slug: string,
  limit = 6
): Promise<RelatedItem[]> {
  const items: RelatedItem[] = [];

  if (type === 'blog') {
    const post = await prisma.blogPost.findFirst({
      where: { slug, status: 'published', deletedAt: null },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    });
    if (!post) return [];

    const tagSlugs = post.tags.map((t) => t.tag.slug);
    const categoryId = post.categoryId;

    const blogOr: Record<string, unknown>[] = [];
    if (categoryId) blogOr.push({ categoryId });
    if (tagSlugs.length) {
      blogOr.push({ tags: { some: { tag: { slug: { in: tagSlugs } } } } });
    }

    const relatedPosts = await prisma.blogPost.findMany({
      where: {
        status: 'published',
        deletedAt: null,
        id: { not: post.id },
        ...(blogOr.length > 0 ? { OR: blogOr } : {}),
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
      take: limit * 3,
      orderBy: { viewCount: 'desc' },
    });

    for (const p of relatedPosts) {
      const pTags = p.tags.map((t) => t.tag.slug);
      const score =
        (p.categoryId === categoryId ? 5 : 0) +
        overlapScore(tagSlugs, pTags) * 2 +
        (p.isFeatured ? 1 : 0);
      items.push({
        type: 'blog',
        title: p.title,
        href: hrefFor('blog', p.slug),
        excerpt: p.excerpt,
        imageUrl: p.featuredImageUrl,
        meta: p.category?.name ?? null,
        score,
      });
    }

    const roadmaps = await prisma.careerRoadmap.findMany({
      where: { isPublished: true },
      take: 3,
      orderBy: { viewCount: 'desc' },
    });
    for (const r of roadmaps) {
      items.push({
        type: 'roadmap',
        title: r.title,
        href: hrefFor('roadmap', r.slug),
        excerpt: r.description,
        meta: r.topic,
        score: 2,
      });
    }
  }

  if (type === 'job' || type === 'internship') {
    const listing =
      type === 'job'
        ? await prisma.job.findFirst({
            where: { slug, status: 'active', deletedAt: null },
            include: { company: true, tags: { include: { tag: true } } },
          })
        : await prisma.internship.findFirst({
            where: { slug, status: 'active', deletedAt: null },
            include: { company: true, tags: { include: { tag: true } } },
          });

    if (!listing) return [];

    const companyId = listing.companyId;
    const city = listing.locationCity;
    const skills = listing.skills;
    const tagSlugs = listing.tags?.map((t) => t.tag.slug) ?? [];

    if (type === 'job') {
      const jobOr: Record<string, unknown>[] = [{ companyId }];
      if (city) jobOr.push({ locationCity: city });

      const siblingJobs = await prisma.job.findMany({
        where: {
          status: 'active',
          deletedAt: null,
          id: { not: listing.id },
          OR: jobOr,
        },
        include: { company: true },
        take: limit * 2,
        orderBy: { publishedAt: 'desc' },
      });
      for (const j of siblingJobs) {
        const score =
          (j.companyId === companyId ? 6 : 0) +
          (j.locationCity === city ? 3 : 0) +
          overlapScore(skills, j.skills) +
          (j.isFeatured ? 1 : 0);
        items.push({
          type: 'job',
          title: j.title,
          href: hrefFor('job', j.slug),
          excerpt: j.company?.name,
          meta: j.locationCity,
          score,
        });
      }
    } else {
      const internOr: Record<string, unknown>[] = [{ companyId }];
      if (city) internOr.push({ locationCity: city });

      const siblingInternships = await prisma.internship.findMany({
        where: {
          status: 'active',
          deletedAt: null,
          id: { not: listing.id },
          OR: internOr,
        },
        include: { company: true },
        take: limit * 2,
        orderBy: { publishedAt: 'desc' },
      });
      for (const i of siblingInternships) {
        const score =
          (i.companyId === companyId ? 6 : 0) +
          (i.locationCity === city ? 3 : 0) +
          overlapScore(skills, i.skills) +
          (i.isFeatured ? 1 : 0);
        items.push({
          type: 'internship',
          title: i.title,
          href: hrefFor('internship', i.slug),
          excerpt: i.company?.name,
          meta: i.locationCity,
          score,
        });
      }
    }

    if (listing.company) {
      items.push({
        type: 'company',
        title: `${listing.company.name} Profile`,
        href: hrefFor('company', listing.company.slug),
        excerpt: 'Company overview, hiring process, and open roles',
        score: 7,
      });

      const guide = await prisma.blogPost.findFirst({
        where: {
          slug: `${listing.company.slug}-campus-hiring-guide-2026`,
          status: 'published',
        },
      });
      if (guide) {
        items.push({
          type: 'blog',
          title: guide.title,
          href: hrefFor('blog', guide.slug),
          excerpt: guide.excerpt,
          score: 8,
        });
      }
    }
  }

  if (type === 'company') {
    const company = await prisma.company.findFirst({
      where: { slug, deletedAt: null },
    });
    if (!company) return [];

    const [jobs, internships, guide] = await Promise.all([
      prisma.job.findMany({
        where: { companyId: company.id, status: 'active', deletedAt: null },
        take: 4,
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.internship.findMany({
        where: { companyId: company.id, status: 'active', deletedAt: null },
        take: 3,
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.blogPost.findFirst({
        where: { slug: `${company.slug}-campus-hiring-guide-2026`, status: 'published' },
      }),
    ]);

    for (const j of jobs) {
      items.push({
        type: 'job',
        title: j.title,
        href: hrefFor('job', j.slug),
        meta: j.locationCity,
        score: 6,
      });
    }
    for (const i of internships) {
      items.push({
        type: 'internship',
        title: i.title,
        href: hrefFor('internship', i.slug),
        meta: i.locationCity,
        score: 5,
      });
    }
    if (guide) {
      items.push({
        type: 'blog',
        title: guide.title,
        href: hrefFor('blog', guide.slug),
        excerpt: guide.excerpt,
        score: 9,
      });
    }
  }

  if (type === 'roadmap') {
    const roadmap = await prisma.careerRoadmap.findFirst({
      where: { slug, isPublished: true },
    });
    if (!roadmap) return [];

    const siblings = await prisma.careerRoadmap.findMany({
      where: { isPublished: true, id: { not: roadmap.id } },
      take: limit * 2,
      orderBy: { viewCount: 'desc' },
    });
    for (const r of siblings) {
      const score =
        (r.topic === roadmap.topic ? 5 : 0) +
        (r.difficulty === roadmap.difficulty ? 2 : 0) +
        (r.isPublished ? 1 : 0);
      items.push({
        type: 'roadmap',
        title: r.title,
        href: hrefFor('roadmap', r.slug),
        excerpt: r.description,
        meta: r.topic,
        score,
      });
    }

    const prepPosts = await prisma.blogPost.findMany({
      where: {
        status: 'published',
        category: { slug: { in: ['placement-prep', 'career-guides'] } },
      },
      take: 4,
      orderBy: { viewCount: 'desc' },
    });
    for (const p of prepPosts) {
      items.push({
        type: 'blog',
        title: p.title,
        href: hrefFor('blog', p.slug),
        excerpt: p.excerpt,
        score: 3,
      });
    }
  }

  if (type === 'interview') {
    const topic = slug;
    const questions = await prisma.interviewQuestion.findMany({
      where: { isPublished: true, topic },
      take: limit,
      orderBy: { viewCount: 'desc' },
    });
    for (const q of questions) {
      items.push({
        type: 'interview',
        title: q.question.slice(0, 80),
        href: `/prepare/interview-questions?topic=${encodeURIComponent(topic)}&difficulty=${q.difficulty}`,
        meta: q.difficulty,
        score: 4,
      });
    }

    const hubArticle = await prisma.blogPost.findFirst({
      where: {
        status: 'published',
        slug: { contains: topic.toLowerCase().replace(/\s+/g, '-') },
        category: { slug: 'interview-articles' },
      },
    });
    if (hubArticle) {
      items.push({
        type: 'blog',
        title: hubArticle.title,
        href: hrefFor('blog', hubArticle.slug),
        excerpt: hubArticle.excerpt,
        score: 7,
      });
    }
  }

  const seen = new Set<string>();
  return items
    .sort((a, b) => b.score - a.score)
    .filter((item) => {
      if (seen.has(item.href)) return false;
      seen.add(item.href);
      return true;
    })
    .slice(0, limit);
}
