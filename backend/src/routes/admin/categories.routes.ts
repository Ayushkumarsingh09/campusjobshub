import { Router, Request, Response, NextFunction } from 'express';
import { CategoryType, Prisma } from '@prisma/client';
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

const categoryListSchema = paginationSchema.extend({
  search: z.string().optional(),
  type: z.nativeEnum(CategoryType).optional(),
  parentId: z.string().uuid().optional(),
});

const categoryCreateSchema = z.object({
  name: z.string().min(2).max(150),
  description: z.string().optional().nullable(),
  parentId: z.string().uuid().optional().nullable(),
  type: z.nativeEnum(CategoryType).default('both'),
  sortOrder: z.number().int().default(0),
});

const categoryUpdateSchema = categoryCreateSchema.partial();

async function ensureUniqueSlug(base: string, excludeId?: string): Promise<string> {
  let counter = 0;
  while (counter < 100) {
    const candidate = counter === 0 ? slugify(base) : uniqueSlug(base, String(counter));
    const existing = await prisma.category.findFirst({
      where: { slug: candidate, ...(excludeId ? { id: { not: excludeId } } : {}) },
    });
    if (!existing) return candidate;
    counter++;
  }
  return uniqueSlug(base, Date.now().toString());
}

router.get('/', requirePerm('categories:write'), validate(categoryListSchema, 'query'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, search, type, parentId } = req.query as unknown as z.infer<typeof categoryListSchema>;
    const where: Prisma.CategoryWhereInput = {};

    if (type) where.type = type;
    if (parentId) where.parentId = parentId;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        include: {
          parent: { select: { id: true, name: true, slug: true } },
          _count: { select: { children: true, jobs: true, blogPosts: true } },
        },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.category.count({ where }),
    ]);

    return success(res, categories, buildPaginationMeta(page, limit, total));
  } catch (err) {
    next(err);
  }
});

router.get('/:id', requirePerm('categories:write'), validate(idParamSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: adminParamId(req) },
      include: {
        parent: true,
        children: { orderBy: { sortOrder: 'asc' } },
      },
    });
    if (!category) throw new NotFoundError('Category');
    return success(res, category);
  } catch (err) {
    next(err);
  }
});

router.post('/', requirePerm('categories:write'), validate(categoryCreateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body as z.infer<typeof categoryCreateSchema>;
    const slug = await ensureUniqueSlug(data.name);

    const category = await prisma.category.create({
      data: {
        ...data,
        slug,
        parentId: data.parentId ?? undefined,
      },
      include: { parent: { select: { id: true, name: true } } },
    });

    await logAudit({
      actorId: req.user!.sub,
      action: 'category.create',
      entityType: 'category',
      entityId: category.id,
      metadata: { name: category.name },
    });

    return success(res, category, undefined, 201);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', requirePerm('categories:write'), validate(idParamSchema, 'params'), validate(categoryUpdateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.category.findUnique({ where: { id: adminParamId(req) } });
    if (!existing) throw new NotFoundError('Category');

    const data = req.body as z.infer<typeof categoryUpdateSchema>;
    const updateData: Prisma.CategoryUpdateInput = { ...data };

    if (data.parentId === adminParamId(req)) {
      throw new ConflictError('Category cannot be its own parent');
    }
    if (data.name && data.name !== existing.name) {
      updateData.slug = await ensureUniqueSlug(data.name, existing.id);
    }

    const category = await prisma.category.update({
      where: { id: adminParamId(req) },
      data: updateData,
      include: { parent: { select: { id: true, name: true } } },
    });

    await logAudit({
      actorId: req.user!.sub,
      action: 'category.update',
      entityType: 'category',
      entityId: category.id,
      metadata: { fields: Object.keys(data) },
    });

    return success(res, category);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requirePerm('categories:write'), validate(idParamSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.category.findUnique({
      where: { id: adminParamId(req) },
      include: { _count: { select: { children: true, jobs: true, blogPosts: true, internships: true } } },
    });
    if (!existing) throw new NotFoundError('Category');

    if (existing._count.children > 0 || existing._count.jobs > 0 || existing._count.blogPosts > 0 || existing._count.internships > 0) {
      throw new ConflictError('Category is in use and cannot be deleted');
    }

    await prisma.category.delete({ where: { id: adminParamId(req) } });

    await logAudit({
      actorId: req.user!.sub,
      action: 'category.delete',
      entityType: 'category',
      entityId: adminParamId(req),
    });

    return success(res, { deleted: true });
  } catch (err) {
    next(err);
  }
});

export default router;
