import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { success } from '../lib/api-response';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { NotFoundError } from '../lib/errors';
import { createResumeSchema, updateResumeSchema } from '../schemas/career';
import { EMPTY_RESUME_CONTENT, RESUME_TEMPLATES } from '../lib/career/resume-types';
import { z } from 'zod';

const idParam = z.object({ id: z.string().uuid() });

const router = Router();

router.get('/templates', (_req: Request, res: Response) => {
  return success(res, RESUME_TEMPLATES);
});

router.use(authenticate);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: req.user!.sub, deletedAt: null },
      orderBy: [{ isPrimary: 'desc' }, { updatedAt: 'desc' }],
    });
    return success(res, resumes);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', validate(idParam, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resume = await prisma.resume.findFirst({
      where: { id: String(req.params.id), userId: req.user!.sub, deletedAt: null },
    });
    if (!resume) throw new NotFoundError('Resume');
    return success(res, resume);
  } catch (err) {
    next(err);
  }
});

router.post('/', validate(createResumeSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, templateId, content, status } = req.body;
    const count = await prisma.resume.count({ where: { userId: req.user!.sub, deletedAt: null } });

    const resume = await prisma.resume.create({
      data: {
        userId: req.user!.sub,
        title,
        templateId: templateId ?? 'modern',
        content: content ?? EMPTY_RESUME_CONTENT,
        status: status ?? 'draft',
        isPrimary: count === 0,
        version: 1,
      },
    });
    return success(res, resume, undefined, 201);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', validate(idParam, 'params'), validate(updateResumeSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.resume.findFirst({
      where: { id: String(req.params.id), userId: req.user!.sub, deletedAt: null },
    });
    if (!existing) throw new NotFoundError('Resume');

    if (req.body.isPrimary) {
      await prisma.resume.updateMany({
        where: { userId: req.user!.sub },
        data: { isPrimary: false },
      });
    }

    const resume = await prisma.resume.update({
      where: { id: existing.id },
      data: {
        ...req.body,
        version: req.body.content ? existing.version + 1 : existing.version,
      },
    });
    return success(res, resume);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/duplicate', validate(idParam, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.resume.findFirst({
      where: { id: String(req.params.id), userId: req.user!.sub, deletedAt: null },
    });
    if (!existing) throw new NotFoundError('Resume');

    const copy = await prisma.resume.create({
      data: {
        userId: req.user!.sub,
        title: `${existing.title} (Copy)`,
        templateId: existing.templateId,
        content: existing.content as object,
        status: 'draft',
        isPrimary: false,
        version: 1,
      },
    });
    return success(res, copy, undefined, 201);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', validate(idParam, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.resume.findFirst({
      where: { id: String(req.params.id), userId: req.user!.sub, deletedAt: null },
    });
    if (!existing) throw new NotFoundError('Resume');

    await prisma.resume.update({
      where: { id: existing.id },
      data: { deletedAt: new Date(), isPrimary: false },
    });
    return success(res, { deleted: true });
  } catch (err) {
    next(err);
  }
});

export default router;
