import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { success, buildPaginationMeta } from '../lib/api-response';
import { validate } from '../middleware/validate';
import { jobListSchema } from '../schemas/jobs';
import { slugParamSchema } from '../schemas/common';
import { NotFoundError } from '../lib/errors';
import { paginationSchema } from '../schemas/common';

const router = Router();

router.get('/', validate(jobListSchema, 'query'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, city, state, category, remote, experienceMin, search, status } = req.query as Record<string, string | number | boolean | undefined>;

    const where: Record<string, unknown> = {
      deletedAt: null,
      status: status ?? 'active',
      expiresAt: { gt: new Date() },
    };

    if (city) where.locationCity = { equals: city as string, mode: 'insensitive' };
    if (state) where.locationState = { equals: state as string, mode: 'insensitive' };
    if (remote) where.isRemote = true;
    if (experienceMin !== undefined) where.experienceMin = { lte: experienceMin };
    if (category) where.category = { slug: category };
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { skills: { has: search as string } },
      ];
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              slug: true,
              logoUrl: true,
              isVerified: true,
              careersPageUrl: true,
            },
          },
          category: { select: { id: true, name: true, slug: true } },
        },
        orderBy: { publishedAt: 'desc' },
        skip: ((page as number) - 1) * (limit as number),
        take: limit as number,
      }),
      prisma.job.count({ where }),
    ]);

    return success(res, jobs, buildPaginationMeta(page as number, limit as number, total));
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', validate(slugParamSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await prisma.job.findFirst({
      where: { slug: String(req.params.slug), deletedAt: null },
      include: {
        company: true,
        category: true,
        tags: { include: { tag: true } },
      },
    });

    if (!job) throw new NotFoundError('Job');

    await prisma.job.update({
      where: { id: job.id },
      data: { viewCount: { increment: 1 } },
    });

    return success(res, job);
  } catch (err) {
    next(err);
  }
});

export default router;
