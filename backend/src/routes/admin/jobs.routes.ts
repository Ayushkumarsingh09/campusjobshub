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

const jobListSchema = paginationSchema.extend({
  search: z.string().optional(),
  status: z.nativeEnum(ListingStatus).optional(),
});

const jobCreateSchema = z.object({
  title: z.string().min(5).max(300),
  description: z.string().min(50),
  companyId: z.string().uuid(),
  categoryId: z.string().uuid().optional().nullable(),
  locationCity: z.string().optional().nullable(),
  locationState: z.string().optional().nullable(),
  isRemote: z.boolean().default(false),
  experienceMin: z.number().min(0).default(0),
  experienceMax: z.number().optional().nullable(),
  salaryMin: z.number().optional().nullable(),
  salaryMax: z.number().optional().nullable(),
  salaryDisclosed: z.boolean().default(true),
  employmentType: z.enum(['full_time', 'part_time', 'contract', 'freelance', 'temporary']).default('full_time'),
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

const jobUpdateSchema = jobCreateSchema.partial();

const bulkActionSchema = z.object({
  action: z.enum(['publish', 'delete', 'feature']),
  ids: z.array(z.string().uuid()).min(1),
});

async function ensureUniqueSlug(base: string, excludeId?: string): Promise<string> {
  let counter = 0;
  while (counter < 100) {
    const candidate = counter === 0 ? slugify(base) : uniqueSlug(base, String(counter));
    const existing = await prisma.job.findFirst({
      where: { slug: candidate, ...(excludeId ? { id: { not: excludeId } } : {}) },
    });
    if (!existing) return candidate;
    counter++;
  }
  return uniqueSlug(base, Date.now().toString());
}

async function syncTags(jobId: string, tagIds: string[]) {
  await prisma.jobTag.deleteMany({ where: { jobId } });
  if (tagIds.length) {
    await prisma.jobTag.createMany({ data: tagIds.map((tagId) => ({ jobId, tagId })) });
  }
}

router.get('/', requirePerm('jobs:read'), validate(jobListSchema, 'query'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, search, status } = req.query as unknown as z.infer<typeof jobListSchema>;
    const where: Prisma.JobWhereInput = { deletedAt: null };

    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
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
      prisma.job.count({ where }),
    ]);

    return success(res, jobs, buildPaginationMeta(page, limit, total));
  } catch (err) {
    next(err);
  }
});

router.get('/:id', requirePerm('jobs:read'), validate(idParamSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await prisma.job.findFirst({
      where: { id: adminParamId(req), deletedAt: null },
      include: {
        company: true,
        category: true,
        postedBy: { select: { id: true, name: true, email: true } },
        tags: { include: { tag: true } },
      },
    });
    if (!job) throw new NotFoundError('Job');
    return success(res, job);
  } catch (err) {
    next(err);
  }
});

router.post('/', requirePerm('jobs:write'), validate(jobCreateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body as z.infer<typeof jobCreateSchema>;
    const { tagIds, ...jobData } = data;
    const slug = await ensureUniqueSlug(data.title);

    const job = await prisma.job.create({
      data: {
        ...jobData,
        slug,
        categoryId: jobData.categoryId ?? undefined,
        postedByUserId: req.user!.sub,
        expiresAt: new Date(jobData.expiresAt),
        applicationDeadline: jobData.applicationDeadline ? new Date(jobData.applicationDeadline) : undefined,
        publishedAt: jobData.status === 'active' ? new Date() : undefined,
      },
      include: { company: true, category: true, tags: { include: { tag: true } } },
    });

    if (tagIds.length) await syncTags(job.id, tagIds);

    await logAudit({
      actorId: req.user!.sub,
      action: 'job.create',
      entityType: 'job',
      entityId: job.id,
      metadata: { title: job.title },
    });

    return success(res, job, undefined, 201);
  } catch (err) {
    next(err);
  }
});

router.post('/bulk', requirePerm('jobs:bulk'), validate(bulkActionSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { action, ids } = req.body as z.infer<typeof bulkActionSchema>;
    let result: { count: number };

    if (action === 'publish') {
      result = await prisma.job.updateMany({
        where: { id: { in: ids }, deletedAt: null },
        data: { status: 'active', publishedAt: new Date() },
      });
    } else if (action === 'delete') {
      result = await prisma.job.updateMany({
        where: { id: { in: ids }, deletedAt: null },
        data: { deletedAt: new Date(), status: 'closed' },
      });
    } else {
      result = await prisma.job.updateMany({
        where: { id: { in: ids }, deletedAt: null },
        data: { isFeatured: true },
      });
    }

    await logAudit({
      actorId: req.user!.sub,
      action: `job.bulk.${action}`,
      entityType: 'job',
      metadata: { ids, count: result.count },
    });

    return success(res, { updated: result.count });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/publish', requirePerm('jobs:write'), validate(idParamSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.job.findFirst({ where: { id: adminParamId(req), deletedAt: null } });
    if (!existing) throw new NotFoundError('Job');

    const job = await prisma.job.update({
      where: { id: adminParamId(req) },
      data: { status: 'active', publishedAt: new Date() },
      include: { company: true, category: true },
    });

    await logAudit({
      actorId: req.user!.sub,
      action: 'job.publish',
      entityType: 'job',
      entityId: job.id,
    });

    return success(res, job);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', requirePerm('jobs:write'), validate(idParamSchema, 'params'), validate(jobUpdateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.job.findFirst({ where: { id: adminParamId(req), deletedAt: null } });
    if (!existing) throw new NotFoundError('Job');

    const data = req.body as z.infer<typeof jobUpdateSchema>;
    const { tagIds, ...jobData } = data;

    const updateData: Prisma.JobUpdateInput = { ...jobData };
    if (jobData.expiresAt) updateData.expiresAt = new Date(jobData.expiresAt);
    if (jobData.applicationDeadline !== undefined) {
      updateData.applicationDeadline = jobData.applicationDeadline ? new Date(jobData.applicationDeadline) : null;
    }
    if (jobData.title && jobData.title !== existing.title) {
      updateData.slug = await ensureUniqueSlug(jobData.title, existing.id);
    }
    if (jobData.status === 'active' && existing.status !== 'active') {
      updateData.publishedAt = new Date();
    }

    const job = await prisma.job.update({
      where: { id: adminParamId(req) },
      data: updateData,
      include: { company: true, category: true, tags: { include: { tag: true } } },
    });

    if (tagIds) await syncTags(job.id, tagIds);

    await logAudit({
      actorId: req.user!.sub,
      action: 'job.update',
      entityType: 'job',
      entityId: job.id,
      metadata: { fields: Object.keys(data) },
    });

    return success(res, job);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requirePerm('jobs:delete'), validate(idParamSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.job.findFirst({ where: { id: adminParamId(req), deletedAt: null } });
    if (!existing) throw new NotFoundError('Job');

    await prisma.job.update({
      where: { id: adminParamId(req) },
      data: { deletedAt: new Date(), status: 'closed' },
    });

    await logAudit({
      actorId: req.user!.sub,
      action: 'job.delete',
      entityType: 'job',
      entityId: adminParamId(req),
    });

    return success(res, { deleted: true });
  } catch (err) {
    next(err);
  }
});

export default router;
