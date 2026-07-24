import { Router, Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { success, buildPaginationMeta } from '../../lib/api-response';
import { validate } from '../../middleware/validate';
import { requirePerm } from '../../middleware/admin';
import { logAudit } from '../../lib/audit';
import { slugify, uniqueSlug } from '../../lib/slug';
import { NotFoundError, ConflictError } from '../../lib/errors';
import { paginationSchema } from '../../schemas/common';
import { adminParamId } from './helpers';

const router = Router();

const idParamSchema = z.object({ id: z.string().uuid() });

const tagListSchema = paginationSchema.extend({
  search: z.string().optional(),
});

const tagCreateSchema = z.object({
  name: z.string().min(2).max(100),
});

const tagUpdateSchema = tagCreateSchema.partial();

async function ensureUniqueSlug(base: string, excludeId?: string): Promise<string> {
  let counter = 0;
  while (counter < 100) {
    const candidate = counter === 0 ? slugify(base) : uniqueSlug(base, String(counter));
    const existing = await prisma.tag.findFirst({
      where: { slug: candidate, ...(excludeId ? { id: { not: excludeId } } : {}) },
    });
    if (!existing) return candidate;
    counter++;
  }
  return uniqueSlug(base, Date.now().toString());
}

router.get('/', requirePerm('tags:write'), validate(tagListSchema, 'query'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, search } = req.query as unknown as z.infer<typeof tagListSchema>;
    const where: Prisma.TagWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [tags, total] = await Promise.all([
      prisma.tag.findMany({
        where,
        orderBy: [{ usageCount: 'desc' }, { name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.tag.count({ where }),
    ]);

    return success(res, tags, buildPaginationMeta(page, limit, total));
  } catch (err) {
    next(err);
  }
});

router.get('/:id', requirePerm('tags:write'), validate(idParamSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tag = await prisma.tag.findUnique({
      where: { id: adminParamId(req) },
      include: {
        _count: {
          select: { jobTags: true, internshipTags: true, blogPostTags: true, interviewQuestionTags: true },
        },
      },
    });
    if (!tag) throw new NotFoundError('Tag');
    return success(res, tag);
  } catch (err) {
    next(err);
  }
});

router.post('/', requirePerm('tags:write'), validate(tagCreateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body as z.infer<typeof tagCreateSchema>;
    const slug = await ensureUniqueSlug(data.name);

    const tag = await prisma.tag.create({
      data: { name: data.name, slug },
    });

    await logAudit({
      actorId: req.user!.sub,
      action: 'tag.create',
      entityType: 'tag',
      entityId: tag.id,
      metadata: { name: tag.name },
    });

    return success(res, tag, undefined, 201);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', requirePerm('tags:write'), validate(idParamSchema, 'params'), validate(tagUpdateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.tag.findUnique({ where: { id: adminParamId(req) } });
    if (!existing) throw new NotFoundError('Tag');

    const data = req.body as z.infer<typeof tagUpdateSchema>;
    const updateData: Prisma.TagUpdateInput = {};

    if (data.name) {
      updateData.name = data.name;
      if (data.name !== existing.name) {
        updateData.slug = await ensureUniqueSlug(data.name, existing.id);
      }
    }

    const tag = await prisma.tag.update({
      where: { id: adminParamId(req) },
      data: updateData,
    });

    await logAudit({
      actorId: req.user!.sub,
      action: 'tag.update',
      entityType: 'tag',
      entityId: tag.id,
      metadata: { fields: Object.keys(data) },
    });

    return success(res, tag);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requirePerm('tags:write'), validate(idParamSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.tag.findUnique({
      where: { id: adminParamId(req) },
      include: {
        _count: {
          select: { jobTags: true, internshipTags: true, blogPostTags: true, interviewQuestionTags: true },
        },
      },
    });
    if (!existing) throw new NotFoundError('Tag');

    const totalUsage =
      existing._count.jobTags +
      existing._count.internshipTags +
      existing._count.blogPostTags +
      existing._count.interviewQuestionTags;

    if (totalUsage > 0) {
      throw new ConflictError('Tag is in use and cannot be deleted');
    }

    await prisma.tag.delete({ where: { id: adminParamId(req) } });

    await logAudit({
      actorId: req.user!.sub,
      action: 'tag.delete',
      entityType: 'tag',
      entityId: adminParamId(req),
    });

    return success(res, { deleted: true });
  } catch (err) {
    next(err);
  }
});

export default router;
