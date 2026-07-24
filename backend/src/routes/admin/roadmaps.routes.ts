import { Router, Request, Response, NextFunction } from 'express';
import { DifficultyLevel, Prisma } from '@prisma/client';
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

const roadmapListSchema = paginationSchema.extend({
  search: z.string().optional(),
  isPublished: z.coerce.boolean().optional(),
  topic: z.string().optional(),
});

const stepSchema = z.object({
  title: z.string().min(1).max(250),
  description: z.string().optional().nullable(),
  stepOrder: z.number().int().min(0),
  resourceUrl: z.string().optional().nullable(),
  resourceType: z.string().max(50).optional().nullable(),
  estimatedHours: z.number().int().min(1).optional().nullable(),
});

const roadmapCreateSchema = z.object({
  title: z.string().min(3).max(250),
  description: z.string().optional().nullable(),
  difficulty: z.nativeEnum(DifficultyLevel).default('medium'),
  estimatedHours: z.number().int().min(1).optional().nullable(),
  thumbnailUrl: z.string().optional().nullable(),
  topic: z.string().max(100).optional().nullable(),
  isPublished: z.boolean().default(false),
  metaTitle: z.string().max(70).optional().nullable(),
  metaDescription: z.string().max(160).optional().nullable(),
  steps: z.array(stepSchema).default([]),
});

const roadmapUpdateSchema = roadmapCreateSchema.partial().omit({ steps: true });

const replaceStepsSchema = z.object({
  steps: z.array(stepSchema).min(1),
});

async function ensureUniqueSlug(base: string, excludeId?: string): Promise<string> {
  let counter = 0;
  while (counter < 100) {
    const candidate = counter === 0 ? slugify(base) : uniqueSlug(base, String(counter));
    const existing = await prisma.careerRoadmap.findFirst({
      where: { slug: candidate, ...(excludeId ? { id: { not: excludeId } } : {}) },
    });
    if (!existing) return candidate;
    counter++;
  }
  return uniqueSlug(base, Date.now().toString());
}

async function createSteps(roadmapId: string, steps: z.infer<typeof stepSchema>[]) {
  if (!steps.length) return;
  await prisma.roadmapStep.createMany({
    data: steps.map((step) => ({
      roadmapId,
      slug: slugify(step.title),
      title: step.title,
      description: step.description,
      stepOrder: step.stepOrder,
      resourceUrl: step.resourceUrl,
      resourceType: step.resourceType,
      estimatedHours: step.estimatedHours,
    })),
  });
}

router.get('/', requirePerm('roadmaps:read'), validate(roadmapListSchema, 'query'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, search, isPublished, topic } = req.query as unknown as z.infer<typeof roadmapListSchema>;
    const where: Prisma.CareerRoadmapWhereInput = {};

    if (isPublished !== undefined) where.isPublished = isPublished;
    if (topic) where.topic = { equals: topic, mode: 'insensitive' };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [roadmaps, total] = await Promise.all([
      prisma.careerRoadmap.findMany({
        where,
        include: { steps: { orderBy: { stepOrder: 'asc' } }, _count: { select: { steps: true } } },
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.careerRoadmap.count({ where }),
    ]);

    return success(res, roadmaps, buildPaginationMeta(page, limit, total));
  } catch (err) {
    next(err);
  }
});

router.get('/:id', requirePerm('roadmaps:read'), validate(idParamSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roadmap = await prisma.careerRoadmap.findUnique({
      where: { id: adminParamId(req) },
      include: { steps: { orderBy: { stepOrder: 'asc' } } },
    });
    if (!roadmap) throw new NotFoundError('Roadmap');
    return success(res, roadmap);
  } catch (err) {
    next(err);
  }
});

router.post('/', requirePerm('roadmaps:write'), validate(roadmapCreateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { steps, ...data } = req.body as z.infer<typeof roadmapCreateSchema>;
    const slug = await ensureUniqueSlug(data.title);

    const roadmap = await prisma.careerRoadmap.create({
      data: { ...data, slug },
    });

    if (steps.length) await createSteps(roadmap.id, steps);

    const result = await prisma.careerRoadmap.findUnique({
      where: { id: roadmap.id },
      include: { steps: { orderBy: { stepOrder: 'asc' } } },
    });

    await logAudit({
      actorId: req.user!.sub,
      action: 'roadmap.create',
      entityType: 'career_roadmap',
      entityId: roadmap.id,
      metadata: { title: roadmap.title },
    });

    return success(res, result, undefined, 201);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', requirePerm('roadmaps:write'), validate(idParamSchema, 'params'), validate(roadmapUpdateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.careerRoadmap.findUnique({ where: { id: adminParamId(req) } });
    if (!existing) throw new NotFoundError('Roadmap');

    const data = req.body as z.infer<typeof roadmapUpdateSchema>;
    const updateData: Prisma.CareerRoadmapUpdateInput = { ...data };

    if (data.title && data.title !== existing.title) {
      updateData.slug = await ensureUniqueSlug(data.title, existing.id);
    }

    const roadmap = await prisma.careerRoadmap.update({
      where: { id: adminParamId(req) },
      data: updateData,
      include: { steps: { orderBy: { stepOrder: 'asc' } } },
    });

    await logAudit({
      actorId: req.user!.sub,
      action: 'roadmap.update',
      entityType: 'career_roadmap',
      entityId: roadmap.id,
      metadata: { fields: Object.keys(data) },
    });

    return success(res, roadmap);
  } catch (err) {
    next(err);
  }
});

router.put('/:id/steps', requirePerm('roadmaps:write'), validate(idParamSchema, 'params'), validate(replaceStepsSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.careerRoadmap.findUnique({ where: { id: adminParamId(req) } });
    if (!existing) throw new NotFoundError('Roadmap');

    const { steps } = req.body as z.infer<typeof replaceStepsSchema>;

    await prisma.$transaction([
      prisma.roadmapStep.deleteMany({ where: { roadmapId: adminParamId(req) } }),
    ]);
    await createSteps(adminParamId(req), steps);

    const roadmap = await prisma.careerRoadmap.findUnique({
      where: { id: adminParamId(req) },
      include: { steps: { orderBy: { stepOrder: 'asc' } } },
    });

    await logAudit({
      actorId: req.user!.sub,
      action: 'roadmap.steps.replace',
      entityType: 'career_roadmap',
      entityId: adminParamId(req),
      metadata: { stepCount: steps.length },
    });

    return success(res, roadmap);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requirePerm('roadmaps:delete'), validate(idParamSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.careerRoadmap.findUnique({ where: { id: adminParamId(req) } });
    if (!existing) throw new NotFoundError('Roadmap');

    await prisma.careerRoadmap.delete({ where: { id: adminParamId(req) } });

    await logAudit({
      actorId: req.user!.sub,
      action: 'roadmap.delete',
      entityType: 'career_roadmap',
      entityId: adminParamId(req),
    });

    return success(res, { deleted: true });
  } catch (err) {
    next(err);
  }
});

export default router;
