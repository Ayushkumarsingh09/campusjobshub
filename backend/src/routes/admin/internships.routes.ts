import { Router, Request, Response, NextFunction } from 'express';
import { ListingStatus, Prisma } from '@prisma/client';
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

const internshipListSchema = paginationSchema.extend({
  search: z.string().optional(),
  status: z.nativeEnum(ListingStatus).optional(),
});

const internshipCreateSchema = z.object({
  title: z.string().min(5).max(300),
  description: z.string().min(50),
  companyId: z.string().uuid(),
  categoryId: z.string().uuid().optional().nullable(),
  locationCity: z.string().optional().nullable(),
  locationState: z.string().optional().nullable(),
  isRemote: z.boolean().default(false),
  durationMonths: z.number().int().min(1).max(24).optional().nullable(),
  stipendMin: z.number().optional().nullable(),
  stipendMax: z.number().optional().nullable(),
  isPaid: z.boolean().default(true),
  ppoAvailable: z.boolean().default(false),
  startDate: z.string().datetime().optional().nullable(),
  skills: z.array(z.string()).default([]),
  tagIds: z.array(z.string().uuid()).default([]),
  applicationMethod: z.enum(['internal', 'external']).default('internal'),
  externalApplyUrl: z.string().url().optional().nullable(),
  status: z.nativeEnum(ListingStatus).default('draft'),
  expiresAt: z.string().datetime(),
  applicationDeadline: z.string().datetime().optional().nullable(),
  isFeatured: z.boolean().default(false),
  metaTitle: z.string().max(70).optional().nullable(),
  metaDescription: z.string().max(160).optional().nullable(),
  ogImageUrl: z.string().optional().nullable(),
  canonicalUrl: z.string().max(500).optional().nullable(),
});

const internshipUpdateSchema = internshipCreateSchema.partial();

const bulkActionSchema = z.object({
  action: z.enum(['publish', 'delete', 'feature']),
  ids: z.array(z.string().uuid()).min(1),
});

async function ensureUniqueSlug(base: string, excludeId?: string): Promise<string> {
  let counter = 0;
  while (counter < 100) {
    const candidate = counter === 0 ? slugify(base) : uniqueSlug(base, String(counter));
    const existing = await prisma.internship.findFirst({
      where: { slug: candidate, ...(excludeId ? { id: { not: excludeId } } : {}) },
    });
    if (!existing) return candidate;
    counter++;
  }
  return uniqueSlug(base, Date.now().toString());
}

async function syncTags(internshipId: string, tagIds: string[]) {
  await prisma.internshipTag.deleteMany({ where: { internshipId } });
  if (tagIds.length) {
    await prisma.internshipTag.createMany({ data: tagIds.map((tagId) => ({ internshipId, tagId })) });
  }
}

router.get('/', requirePerm('internships:read'), validate(internshipListSchema, 'query'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, search, status } = req.query as unknown as z.infer<typeof internshipListSchema>;
    const where: Prisma.InternshipWhereInput = { deletedAt: null };

    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [internships, total] = await Promise.all([
      prisma.internship.findMany({
        where,
        include: {
          company: { select: { id: true, name: true, slug: true, logoUrl: true } },
          category: { select: { id: true, name: true, slug: true } },
          tags: { include: { tag: true } },
        },
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.internship.count({ where }),
    ]);

    return success(res, internships, buildPaginationMeta(page, limit, total));
  } catch (err) {
    next(err);
  }
});

router.get('/:id', requirePerm('internships:read'), validate(idParamSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const internship = await prisma.internship.findFirst({
      where: { id: adminParamId(req), deletedAt: null },
      include: {
        company: true,
        category: true,
        postedBy: { select: { id: true, name: true, email: true } },
        tags: { include: { tag: true } },
      },
    });
    if (!internship) throw new NotFoundError('Internship');
    return success(res, internship);
  } catch (err) {
    next(err);
  }
});

router.post('/', requirePerm('internships:write'), validate(internshipCreateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body as z.infer<typeof internshipCreateSchema>;
    const { tagIds, ...internshipData } = data;
    const slug = await ensureUniqueSlug(data.title);

    const internship = await prisma.internship.create({
      data: {
        ...internshipData,
        slug,
        categoryId: internshipData.categoryId ?? undefined,
        postedByUserId: req.user!.sub,
        expiresAt: new Date(internshipData.expiresAt),
        applicationDeadline: internshipData.applicationDeadline ? new Date(internshipData.applicationDeadline) : undefined,
        startDate: internshipData.startDate ? new Date(internshipData.startDate) : undefined,
        publishedAt: internshipData.status === 'active' ? new Date() : undefined,
      },
      include: { company: true, category: true, tags: { include: { tag: true } } },
    });

    if (tagIds.length) await syncTags(internship.id, tagIds);

    await logAudit({
      actorId: req.user!.sub,
      action: 'internship.create',
      entityType: 'internship',
      entityId: internship.id,
      metadata: { title: internship.title },
    });

    return success(res, internship, undefined, 201);
  } catch (err) {
    next(err);
  }
});

router.post('/bulk', requirePerm('internships:bulk'), validate(bulkActionSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { action, ids } = req.body as z.infer<typeof bulkActionSchema>;
    let result: { count: number };

    if (action === 'publish') {
      result = await prisma.internship.updateMany({
        where: { id: { in: ids }, deletedAt: null },
        data: { status: 'active', publishedAt: new Date() },
      });
    } else if (action === 'delete') {
      result = await prisma.internship.updateMany({
        where: { id: { in: ids }, deletedAt: null },
        data: { deletedAt: new Date(), status: 'closed' },
      });
    } else {
      result = await prisma.internship.updateMany({
        where: { id: { in: ids }, deletedAt: null },
        data: { isFeatured: true },
      });
    }

    await logAudit({
      actorId: req.user!.sub,
      action: `internship.bulk.${action}`,
      entityType: 'internship',
      metadata: { ids, count: result.count },
    });

    return success(res, { updated: result.count });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/publish', requirePerm('internships:write'), validate(idParamSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.internship.findFirst({ where: { id: adminParamId(req), deletedAt: null } });
    if (!existing) throw new NotFoundError('Internship');

    const internship = await prisma.internship.update({
      where: { id: adminParamId(req) },
      data: { status: 'active', publishedAt: new Date() },
      include: { company: true, category: true },
    });

    await logAudit({
      actorId: req.user!.sub,
      action: 'internship.publish',
      entityType: 'internship',
      entityId: internship.id,
    });

    return success(res, internship);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', requirePerm('internships:write'), validate(idParamSchema, 'params'), validate(internshipUpdateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.internship.findFirst({ where: { id: adminParamId(req), deletedAt: null } });
    if (!existing) throw new NotFoundError('Internship');

    const data = req.body as z.infer<typeof internshipUpdateSchema>;
    const { tagIds, ...internshipData } = data;

    const updateData: Prisma.InternshipUpdateInput = { ...internshipData };
    if (internshipData.expiresAt) updateData.expiresAt = new Date(internshipData.expiresAt);
    if (internshipData.applicationDeadline !== undefined) {
      updateData.applicationDeadline = internshipData.applicationDeadline ? new Date(internshipData.applicationDeadline) : null;
    }
    if (internshipData.startDate !== undefined) {
      updateData.startDate = internshipData.startDate ? new Date(internshipData.startDate) : null;
    }
    if (internshipData.title && internshipData.title !== existing.title) {
      updateData.slug = await ensureUniqueSlug(internshipData.title, existing.id);
    }
    if (internshipData.status === 'active' && existing.status !== 'active') {
      updateData.publishedAt = new Date();
    }

    const internship = await prisma.internship.update({
      where: { id: adminParamId(req) },
      data: updateData,
      include: { company: true, category: true, tags: { include: { tag: true } } },
    });

    if (tagIds) await syncTags(internship.id, tagIds);

    await logAudit({
      actorId: req.user!.sub,
      action: 'internship.update',
      entityType: 'internship',
      entityId: internship.id,
      metadata: { fields: Object.keys(data) },
    });

    return success(res, internship);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requirePerm('internships:delete'), validate(idParamSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.internship.findFirst({ where: { id: adminParamId(req), deletedAt: null } });
    if (!existing) throw new NotFoundError('Internship');

    await prisma.internship.update({
      where: { id: adminParamId(req) },
      data: { deletedAt: new Date(), status: 'closed' },
    });

    await logAudit({
      actorId: req.user!.sub,
      action: 'internship.delete',
      entityType: 'internship',
      entityId: adminParamId(req),
    });

    return success(res, { deleted: true });
  } catch (err) {
    next(err);
  }
});

export default router;
