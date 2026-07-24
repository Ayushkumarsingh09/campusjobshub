import { Router, Request, Response, NextFunction } from 'express';
import { ContentStatus, Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { success, buildPaginationMeta } from '../../lib/api-response';
import { validate } from '../../middleware/validate';
import { requirePerm } from '../../middleware/admin';
import { logAudit } from '../../lib/audit';
import { slugify, uniqueSlug } from '../../lib/slug';
import { NotFoundError } from '../../lib/errors';
import { paginationSchema } from '../../schemas/common';
import { adminParamId } from './helpers';

const router = Router();

const idParamSchema = z.object({ id: z.string().uuid() });

const faqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

const blogListSchema = paginationSchema.extend({
  search: z.string().optional(),
  status: z.nativeEnum(ContentStatus).optional(),
  authorId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
});

const blogCreateSchema = z.object({
  title: z.string().min(5).max(300),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(100),
  featuredImageUrl: z.string().optional().nullable(),
  authorId: z.string().uuid(),
  categoryId: z.string().uuid().optional().nullable(),
  status: z.nativeEnum(ContentStatus).default('draft'),
  scheduledAt: z.string().datetime().optional().nullable(),
  isFeatured: z.boolean().default(false),
  faq: z.array(faqItemSchema).default([]),
  internalLinks: z.array(z.object({ title: z.string(), url: z.string() })).default([]),
  tagIds: z.array(z.string().uuid()).default([]),
  metaTitle: z.string().max(70).optional().nullable(),
  metaDescription: z.string().max(160).optional().nullable(),
  ogImageUrl: z.string().optional().nullable(),
  canonicalUrl: z.string().max(500).optional().nullable(),
});

const blogUpdateSchema = blogCreateSchema.partial();

function calculateReadingTime(content: string): number {
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

async function ensureUniqueSlug(base: string, excludeId?: string): Promise<string> {
  let counter = 0;
  while (counter < 100) {
    const candidate = counter === 0 ? slugify(base) : uniqueSlug(base, String(counter));
    const existing = await prisma.blogPost.findFirst({
      where: { slug: candidate, ...(excludeId ? { id: { not: excludeId } } : {}) },
    });
    if (!existing) return candidate;
    counter++;
  }
  return uniqueSlug(base, Date.now().toString());
}

async function syncTags(blogPostId: string, tagIds: string[]) {
  await prisma.blogPostTag.deleteMany({ where: { blogPostId } });
  if (tagIds.length) {
    await prisma.blogPostTag.createMany({ data: tagIds.map((tagId) => ({ blogPostId, tagId })) });
  }
}

function applyStatusTransition(
  status: ContentStatus | undefined,
  scheduledAt: string | null | undefined,
  existingStatus?: ContentStatus
): { status?: ContentStatus; publishedAt?: Date | null; scheduledAt?: Date | null } {
  if (!status) return {};

  const result: { status: ContentStatus; publishedAt?: Date | null; scheduledAt?: Date | null } = { status };

  if (status === 'published') {
    result.publishedAt = new Date();
    result.scheduledAt = null;
  } else if (status === 'draft') {
    if (existingStatus === 'published') result.publishedAt = null;
  } else if (status === 'archived') {
    result.scheduledAt = null;
  }

  if (scheduledAt) {
    result.scheduledAt = new Date(scheduledAt);
    if (status === 'draft') result.status = 'draft';
  }

  return result;
}

router.get('/', requirePerm('blog:read'), validate(blogListSchema, 'query'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, search, status, authorId, categoryId } = req.query as unknown as z.infer<typeof blogListSchema>;
    const where: Prisma.BlogPostWhereInput = { deletedAt: null };

    if (status) where.status = status;
    if (authorId) where.authorId = authorId;
    if (categoryId) where.categoryId = categoryId;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, email: true } },
          category: { select: { id: true, name: true, slug: true } },
          tags: { include: { tag: true } },
        },
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return success(res, posts, buildPaginationMeta(page, limit, total));
  } catch (err) {
    next(err);
  }
});

router.get('/:id', requirePerm('blog:read'), validate(idParamSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await prisma.blogPost.findFirst({
      where: { id: adminParamId(req), deletedAt: null },
      include: {
        author: { select: { id: true, name: true, email: true, avatarUrl: true } },
        category: true,
        tags: { include: { tag: true } },
      },
    });
    if (!post) throw new NotFoundError('Blog post');
    return success(res, post);
  } catch (err) {
    next(err);
  }
});

router.post('/', requirePerm('blog:write'), validate(blogCreateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body as z.infer<typeof blogCreateSchema>;
    const { tagIds, scheduledAt, status, ...postData } = data;
    const slug = await ensureUniqueSlug(data.title);
    const readingTimeMinutes = calculateReadingTime(data.content);
    const statusFields = applyStatusTransition(status, scheduledAt);

    const post = await prisma.blogPost.create({
      data: {
        ...postData,
        slug,
        categoryId: postData.categoryId ?? undefined,
        readingTimeMinutes,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
        ...statusFields,
      },
      include: {
        author: { select: { id: true, name: true } },
        category: true,
        tags: { include: { tag: true } },
      },
    });

    if (tagIds.length) await syncTags(post.id, tagIds);

    await logAudit({
      actorId: req.user!.sub,
      action: 'blog.create',
      entityType: 'blog_post',
      entityId: post.id,
      metadata: { title: post.title, status: post.status },
    });

    return success(res, post, undefined, 201);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', requirePerm('blog:write'), validate(idParamSchema, 'params'), validate(blogUpdateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.blogPost.findFirst({ where: { id: adminParamId(req), deletedAt: null } });
    if (!existing) throw new NotFoundError('Blog post');

    const data = req.body as z.infer<typeof blogUpdateSchema>;
    const { tagIds, scheduledAt, status, content, ...postData } = data;

    const updateData: Prisma.BlogPostUpdateInput = { ...postData };

    if (content) {
      updateData.content = content;
      updateData.readingTimeMinutes = calculateReadingTime(content);
    }
    if (postData.title && postData.title !== existing.title) {
      updateData.slug = await ensureUniqueSlug(postData.title, existing.id);
    }

    const statusFields = applyStatusTransition(status, scheduledAt, existing.status);
    Object.assign(updateData, statusFields);

    const post = await prisma.blogPost.update({
      where: { id: adminParamId(req) },
      data: updateData,
      include: {
        author: { select: { id: true, name: true } },
        category: true,
        tags: { include: { tag: true } },
      },
    });

    if (tagIds) await syncTags(post.id, tagIds);

    await logAudit({
      actorId: req.user!.sub,
      action: 'blog.update',
      entityType: 'blog_post',
      entityId: post.id,
      metadata: { fields: Object.keys(data) },
    });

    return success(res, post);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/publish', requirePerm('blog:publish'), validate(idParamSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.blogPost.findFirst({ where: { id: adminParamId(req), deletedAt: null } });
    if (!existing) throw new NotFoundError('Blog post');

    const post = await prisma.blogPost.update({
      where: { id: adminParamId(req) },
      data: { status: 'published', publishedAt: new Date(), scheduledAt: null },
      include: { author: { select: { id: true, name: true } }, category: true },
    });

    await logAudit({
      actorId: req.user!.sub,
      action: 'blog.publish',
      entityType: 'blog_post',
      entityId: post.id,
    });

    return success(res, post);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requirePerm('blog:delete'), validate(idParamSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.blogPost.findFirst({ where: { id: adminParamId(req), deletedAt: null } });
    if (!existing) throw new NotFoundError('Blog post');

    await prisma.blogPost.update({
      where: { id: adminParamId(req) },
      data: { deletedAt: new Date(), status: 'archived' },
    });

    await logAudit({
      actorId: req.user!.sub,
      action: 'blog.delete',
      entityType: 'blog_post',
      entityId: adminParamId(req),
    });

    return success(res, { deleted: true });
  } catch (err) {
    next(err);
  }
});

export default router;
