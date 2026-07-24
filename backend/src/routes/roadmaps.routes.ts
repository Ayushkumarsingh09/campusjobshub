import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { success } from '../lib/api-response';
import { validate } from '../middleware/validate';
import { slugParamSchema } from '../schemas/common';
import { NotFoundError } from '../lib/errors';

const router = Router();

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const roadmaps = await prisma.careerRoadmap.findMany({
      where: { isPublished: true },
      include: { steps: { orderBy: { stepOrder: 'asc' }, take: 3 } },
      orderBy: { title: 'asc' },
    });
    return success(res, roadmaps);
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', validate(slugParamSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roadmap = await prisma.careerRoadmap.findFirst({
      where: { slug: String(req.params.slug), isPublished: true },
      include: { steps: { orderBy: { stepOrder: 'asc' } } },
    });
    if (!roadmap) throw new NotFoundError('Roadmap');
    return success(res, roadmap);
  } catch (err) {
    next(err);
  }
});

export default router;
