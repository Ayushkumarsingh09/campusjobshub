import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { success } from '../lib/api-response';
import { validate } from '../middleware/validate';
import { authenticate, optionalAuth } from '../middleware/auth';
import { NotFoundError } from '../lib/errors';
import { saveCompanySchema } from '../schemas/career';

const idParam = z.object({ id: z.string().uuid() });
const checkSchema = z.object({ companyId: z.string().uuid() });

const router = Router();

router.get('/check', optionalAuth, validate(checkSchema, 'query'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return success(res, { saved: false });
    const { companyId } = req.query as Record<string, string>;
    const saved = await prisma.savedCompany.findUnique({
      where: { userId_companyId: { userId: req.user.sub, companyId } },
    });
    return success(res, { saved: Boolean(saved), savedCompanyId: saved?.id ?? null });
  } catch (err) {
    next(err);
  }
});

router.use(authenticate);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const saved = await prisma.savedCompany.findMany({
      where: { userId: req.user!.sub },
      include: {
        company: {
          select: {
            id: true, slug: true, name: true, logoUrl: true, industry: true,
            jobCount: true, internshipCount: true, isVerified: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return success(res, saved);
  } catch (err) {
    next(err);
  }
});

router.post('/', validate(saveCompanySchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { companyId, notes, alertEnabled } = req.body;
    const company = await prisma.company.findFirst({ where: { id: companyId, deletedAt: null } });
    if (!company) throw new NotFoundError('Company');

    const saved = await prisma.savedCompany.upsert({
      where: { userId_companyId: { userId: req.user!.sub, companyId } },
      update: { notes: notes ?? undefined, alertEnabled: alertEnabled ?? true },
      create: {
        userId: req.user!.sub,
        companyId,
        notes: notes ?? null,
        alertEnabled: alertEnabled ?? true,
      },
      include: { company: true },
    });
    return success(res, saved, undefined, 201);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', validate(idParam, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.savedCompany.findFirst({
      where: { id: String(req.params.id), userId: req.user!.sub },
    });
    if (!existing) throw new NotFoundError('Saved company');

    const { notes, alertEnabled } = req.body;
    const saved = await prisma.savedCompany.update({
      where: { id: existing.id },
      data: {
        ...(notes !== undefined ? { notes } : {}),
        ...(alertEnabled !== undefined ? { alertEnabled } : {}),
      },
      include: { company: true },
    });
    return success(res, saved);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', validate(idParam, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.savedCompany.findFirst({
      where: { id: String(req.params.id), userId: req.user!.sub },
    });
    if (!existing) throw new NotFoundError('Saved company');
    await prisma.savedCompany.delete({ where: { id: existing.id } });
    return success(res, { deleted: true });
  } catch (err) {
    next(err);
  }
});

export default router;
