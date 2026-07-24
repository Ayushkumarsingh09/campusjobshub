import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { success, buildPaginationMeta } from '../lib/api-response';
import { validate } from '../middleware/validate';
import { paginationSchema, slugParamSchema } from '../schemas/common';
import { NotFoundError } from '../lib/errors';

const router = Router();

router.get('/', validate(paginationSchema, 'query'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = req.query as unknown as { page: number; limit: number };
    const where = { deletedAt: null, isVerified: true };

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.company.count({ where }),
    ]);

    return success(res, companies, buildPaginationMeta(page, limit, total));
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', validate(slugParamSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const company = await prisma.company.findFirst({
      where: { slug: String(req.params.slug), deletedAt: null },
      include: {
        jobs: {
          where: { status: 'active', deletedAt: null, expiresAt: { gt: new Date() } },
          take: 10,
          orderBy: { publishedAt: 'desc' },
        },
        internships: {
          where: { status: 'active', deletedAt: null, expiresAt: { gt: new Date() } },
          take: 10,
          orderBy: { publishedAt: 'desc' },
        },
      },
    });

    if (!company) throw new NotFoundError('Company');
    return success(res, company);
  } catch (err) {
    next(err);
  }
});

export default router;
