import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { success, buildPaginationMeta } from '../lib/api-response';
import { validate } from '../middleware/validate';
import { paginationSchema } from '../schemas/common';

const iqListSchema = paginationSchema.extend({
  company: z.string().optional(),
  topic: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
});

const router = Router();

router.get('/', validate(iqListSchema, 'query'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, company, topic, difficulty } = req.query as Record<string, string | number | undefined>;

    const where: Record<string, unknown> = { isPublished: true };
    if (company) where.company = { slug: company };
    if (topic) where.topic = topic;
    if (difficulty) where.difficulty = difficulty;

    const [questions, total] = await Promise.all([
      prisma.interviewQuestion.findMany({
        where,
        include: { company: { select: { name: true, slug: true } } },
        orderBy: { createdAt: 'desc' },
        skip: ((page as number) - 1) * (limit as number),
        take: limit as number,
      }),
      prisma.interviewQuestion.count({ where }),
    ]);

    return success(res, questions, buildPaginationMeta(page as number, limit as number, total));
  } catch (err) {
    next(err);
  }
});

export default router;
