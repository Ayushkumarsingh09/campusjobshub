import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { success } from '../lib/api-response';
import { validate } from '../middleware/validate';
import { authenticate, optionalAuth } from '../middleware/auth';
import { NotFoundError } from '../lib/errors';
import { saveJobSchema, updateSavedJobSchema } from '../schemas/career';

const idParam = z.object({ id: z.string().uuid() });
const checkSchema = z.object({
  jobId: z.string().uuid().optional(),
  internshipId: z.string().uuid().optional(),
});

const router = Router();

router.get('/check', optionalAuth, validate(checkSchema, 'query'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return success(res, { saved: false });
    const { jobId, internshipId } = req.query as Record<string, string | undefined>;
    const saved = await prisma.savedJob.findFirst({
      where: {
        userId: req.user.sub,
        ...(jobId ? { jobId } : {}),
        ...(internshipId ? { internshipId } : {}),
      },
    });
    return success(res, { saved: Boolean(saved), savedJobId: saved?.id ?? null });
  } catch (err) {
    next(err);
  }
});

router.use(authenticate);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { folder } = req.query as Record<string, string | undefined>;
    const saved = await prisma.savedJob.findMany({
      where: {
        userId: req.user!.sub,
        ...(folder ? { folder } : {}),
      },
      include: {
        job: { include: { company: { select: { id: true, name: true, slug: true, logoUrl: true } } } },
        internship: { include: { company: { select: { id: true, name: true, slug: true, logoUrl: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return success(res, saved);
  } catch (err) {
    next(err);
  }
});

router.post('/', validate(saveJobSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jobId, internshipId, notes, folder, reminderAt } = req.body;
    const saved = await prisma.savedJob.create({
      data: {
        userId: req.user!.sub,
        jobId: jobId ?? null,
        internshipId: internshipId ?? null,
        notes: notes ?? null,
        folder: folder ?? 'default',
        reminderAt: reminderAt ? new Date(reminderAt) : null,
      },
      include: {
        job: { include: { company: { select: { id: true, name: true, slug: true, logoUrl: true } } } },
        internship: { include: { company: { select: { id: true, name: true, slug: true, logoUrl: true } } } },
      },
    });
    return success(res, saved, undefined, 201);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', validate(idParam, 'params'), validate(updateSavedJobSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.savedJob.findFirst({
      where: { id: String(req.params.id), userId: req.user!.sub },
    });
    if (!existing) throw new NotFoundError('Saved job');

    const { notes, folder, reminderAt } = req.body;
    const saved = await prisma.savedJob.update({
      where: { id: existing.id },
      data: {
        ...(notes !== undefined ? { notes } : {}),
        ...(folder !== undefined ? { folder } : {}),
        ...(reminderAt !== undefined ? { reminderAt: reminderAt ? new Date(reminderAt) : null } : {}),
      },
      include: {
        job: { include: { company: { select: { id: true, name: true, slug: true, logoUrl: true } } } },
        internship: { include: { company: { select: { id: true, name: true, slug: true, logoUrl: true } } } },
      },
    });
    return success(res, saved);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', validate(idParam, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.savedJob.findFirst({
      where: { id: String(req.params.id), userId: req.user!.sub },
    });
    if (!existing) throw new NotFoundError('Saved job');
    await prisma.savedJob.delete({ where: { id: existing.id } });
    return success(res, { deleted: true });
  } catch (err) {
    next(err);
  }
});

export default router;
