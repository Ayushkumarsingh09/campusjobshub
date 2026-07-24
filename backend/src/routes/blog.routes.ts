import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { success, buildPaginationMeta } from '../lib/api-response';
import { validate } from '../middleware/validate';
import { paginationSchema, slugParamSchema } from '../schemas/common';
import { NotFoundError } from '../lib/errors';
import { z } from 'zod';

const blogListSchema = paginationSchema.extend({
  category: z.string().optional(),
  tag: z.string().optional(),
});

const router = Router();

router.get('/', validate(blogListSchema, 'query'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, category, tag } = req.query as Record<string, string | number | undefined>;

    const where: Record<string, unknown> = {
      status: 'published',
      deletedAt: null,
    };
    if (category) where.category = { slug: category };
    if (tag) where.tags = { some: { tag: { slug: tag } } };

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, avatarUrl: true } },
          category: { select: { id: true, name: true, slug: true } },
          tags: { include: { tag: true } },
        },
        orderBy: { publishedAt: 'desc' },
        skip: ((page as number) - 1) * (limit as number),
        take: limit as number,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return success(res, posts, buildPaginationMeta(page as number, limit as number, total));
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', validate(slugParamSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await prisma.blogPost.findFirst({
      where: { slug: String(req.params.slug), status: 'published', deletedAt: null },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        category: true,
        tags: { include: { tag: true } },
      },
    });

    if (!post) throw new NotFoundError('Blog post');

    await prisma.blogPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });

    return success(res, post);
  } catch (err) {
    next(err);
  }
});

export default router;
