import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { success } from '../lib/api-response';
import { validate } from '../middleware/validate';

const searchSchema = z.object({
  q: z.string().min(1).max(200),
  type: z.enum(['all', 'jobs', 'internships', 'companies', 'blog']).default('all'),
  limit: z.coerce.number().int().min(1).max(20).default(10),
});

const router = Router();

router.get('/', validate(searchSchema, 'query'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, type, limit } = req.query as unknown as { q: string; type: string; limit: number };
    const results: Record<string, unknown[]> = {};

    const searchFilter = {
      OR: [
        { title: { contains: q, mode: 'insensitive' as const } },
        { description: { contains: q, mode: 'insensitive' as const } },
      ],
    };

    if (type === 'all' || type === 'jobs') {
      results.jobs = await prisma.job.findMany({
        where: { ...searchFilter, status: 'active', deletedAt: null },
        select: { id: true, slug: true, title: true, locationCity: true, company: { select: { name: true } } },
        take: limit,
      });
    }

    if (type === 'all' || type === 'internships') {
      results.internships = await prisma.internship.findMany({
        where: { ...searchFilter, status: 'active', deletedAt: null },
        select: { id: true, slug: true, title: true, locationCity: true, company: { select: { name: true } } },
        take: limit,
      });
    }

    if (type === 'all' || type === 'companies') {
      results.companies = await prisma.company.findMany({
        where: {
          name: { contains: q, mode: 'insensitive' },
          deletedAt: null,
          isVerified: true,
        },
        select: { id: true, slug: true, name: true, logoUrl: true },
        take: limit,
      });
    }

    if (type === 'all' || type === 'blog') {
      results.blog = await prisma.blogPost.findMany({
        where: {
          status: 'published',
          deletedAt: null,
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { excerpt: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { id: true, slug: true, title: true, excerpt: true, publishedAt: true },
        take: limit,
      });
    }

    return success(res, results);
  } catch (err) {
    next(err);
  }
});

export default router;
