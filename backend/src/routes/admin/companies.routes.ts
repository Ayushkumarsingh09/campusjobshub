import { Router, Request, Response, NextFunction } from 'express';
import { CompanySize, Prisma } from '@prisma/client';
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

const companyListSchema = paginationSchema.extend({
  search: z.string().optional(),
  isVerified: z.coerce.boolean().optional(),
});

const companyCreateSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  website: z.string().max(500).optional().nullable(),
  industry: z.string().max(100).optional().nullable(),
  companySize: z.nativeEnum(CompanySize).optional().nullable(),
  headquartersCity: z.string().max(100).optional().nullable(),
  headquartersState: z.string().max(100).optional().nullable(),
  ownerUserId: z.string().uuid(),
  careersPageUrl: z.string().max(500).optional().nullable(),
  hiringProcess: z.string().optional().nullable(),
  salaryInformation: z.string().optional().nullable(),
  interviewExperience: z.string().optional().nullable(),
  eligibilityCriteria: z.string().optional().nullable(),
  metaTitle: z.string().max(70).optional().nullable(),
  metaDescription: z.string().max(160).optional().nullable(),
  ogImageUrl: z.string().optional().nullable(),
});

const companyUpdateSchema = companyCreateSchema.partial().omit({ ownerUserId: true }).extend({
  ownerUserId: z.string().uuid().optional(),
});

async function ensureUniqueSlug(base: string, excludeId?: string): Promise<string> {
  let counter = 0;
  while (counter < 100) {
    const candidate = counter === 0 ? slugify(base) : uniqueSlug(base, String(counter));
    const existing = await prisma.company.findFirst({
      where: { slug: candidate, ...(excludeId ? { id: { not: excludeId } } : {}) },
    });
    if (!existing) return candidate;
    counter++;
  }
  return uniqueSlug(base, Date.now().toString());
}

router.get('/', requirePerm('companies:read'), validate(companyListSchema, 'query'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, search, isVerified } = req.query as unknown as z.infer<typeof companyListSchema>;
    const where: Prisma.CompanyWhereInput = { deletedAt: null };

    if (isVerified !== undefined) where.isVerified = isVerified;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { industry: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        include: { owner: { select: { id: true, name: true, email: true } } },
        orderBy: { updatedAt: 'desc' },
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

router.get('/:id', requirePerm('companies:read'), validate(idParamSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const company = await prisma.company.findFirst({
      where: { id: adminParamId(req), deletedAt: null },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { jobs: true, internships: true } },
      },
    });
    if (!company) throw new NotFoundError('Company');
    return success(res, company);
  } catch (err) {
    next(err);
  }
});

router.post('/', requirePerm('companies:write'), validate(companyCreateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body as z.infer<typeof companyCreateSchema>;
    const slug = await ensureUniqueSlug(data.name);

    const company = await prisma.company.create({
      data: { ...data, slug },
      include: { owner: { select: { id: true, name: true, email: true } } },
    });

    await logAudit({
      actorId: req.user!.sub,
      action: 'company.create',
      entityType: 'company',
      entityId: company.id,
      metadata: { name: company.name },
    });

    return success(res, company, undefined, 201);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', requirePerm('companies:write'), validate(idParamSchema, 'params'), validate(companyUpdateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.company.findFirst({ where: { id: adminParamId(req), deletedAt: null } });
    if (!existing) throw new NotFoundError('Company');

    const data = req.body as z.infer<typeof companyUpdateSchema>;
    const updateData: Prisma.CompanyUpdateInput = { ...data };

    if (data.name && data.name !== existing.name) {
      updateData.slug = await ensureUniqueSlug(data.name, existing.id);
    }

    const company = await prisma.company.update({
      where: { id: adminParamId(req) },
      data: updateData,
      include: { owner: { select: { id: true, name: true, email: true } } },
    });

    await logAudit({
      actorId: req.user!.sub,
      action: 'company.update',
      entityType: 'company',
      entityId: company.id,
      metadata: { fields: Object.keys(data) },
    });

    return success(res, company);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/verify', requirePerm('companies:verify'), validate(idParamSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.company.findFirst({ where: { id: adminParamId(req), deletedAt: null } });
    if (!existing) throw new NotFoundError('Company');

    const company = await prisma.company.update({
      where: { id: adminParamId(req) },
      data: { isVerified: true, verifiedAt: new Date() },
    });

    await logAudit({
      actorId: req.user!.sub,
      action: 'company.verify',
      entityType: 'company',
      entityId: company.id,
    });

    return success(res, company);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requirePerm('companies:delete'), validate(idParamSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.company.findFirst({ where: { id: adminParamId(req), deletedAt: null } });
    if (!existing) throw new NotFoundError('Company');

    await prisma.company.update({
      where: { id: adminParamId(req) },
      data: { deletedAt: new Date() },
    });

    await logAudit({
      actorId: req.user!.sub,
      action: 'company.delete',
      entityType: 'company',
      entityId: adminParamId(req),
    });

    return success(res, { deleted: true });
  } catch (err) {
    next(err);
  }
});

export default router;
