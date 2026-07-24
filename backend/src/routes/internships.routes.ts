import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { success, buildPaginationMeta } from '../lib/api-response';
import { validate } from '../middleware/validate';
import { paginationSchema } from '../schemas/common';
import { slugParamSchema } from '../schemas/common';
import { z } from 'zod';
import { NotFoundError } from '../lib/errors';

const internshipListSchema = paginationSchema.extend({
  city: z.string().optional(),
  ppo: z.coerce.boolean().optional(),
  search: z.string().optional(),
});

const router = Router();

router.get('/', validate(internshipListSchema, 'query'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, city, ppo, search } = req.query as Record<string, string | number | boolean | undefined>;

    const where: Record<string, unknown> = {
      deletedAt: null,
      status: 'active',
      expiresAt: { gt: new Date() },
    };

    if (city) where.locationCity = { equals: city as string, mode: 'insensitive' };
    if (ppo) where.ppoAvailable = true;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { skills: { has: search as string } },
      ];
    }

    const [internships, total] = await Promise.all([
      prisma.internship.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              slug: true,
              logoUrl: true,
              careersPageUrl: true,
            },
          },
          category: { select: { id: true, name: true, slug: true } },
        },
        orderBy: { publishedAt: 'desc' },
        skip: ((page as number) - 1) * (limit as number),
        take: limit as number,
      }),
      prisma.internship.count({ where }),
    ]);

    return success(res, internships, buildPaginationMeta(page as number, limit as number, total));
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', validate(slugParamSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const internship = await prisma.internship.findFirst({
      where: { slug: String(req.params.slug), deletedAt: null },
      include: { company: true, category: true, tags: { include: { tag: true } } },
    });

    if (!internship) throw new NotFoundError('Internship');

    await prisma.internship.update({
      where: { id: internship.id },
      data: { viewCount: { increment: 1 } },
    });

    return success(res, internship);
  } catch (err) {
    next(err);
  }
});

export default router;
