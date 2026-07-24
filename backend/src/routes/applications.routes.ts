import { Router, Request, Response, NextFunction } from 'express';
import { ApplicationStatus } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { success } from '../lib/api-response';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { NotFoundError } from '../lib/errors';
import { createApplicationSchema, updateApplicationSchema } from '../schemas/career';

const idParam = z.object({ id: z.string().uuid() });

const router = Router();
router.use(authenticate);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query as Record<string, string | undefined>;
    const where: Record<string, unknown> = { userId: req.user!.sub };
    if (status) where.status = status;

    const applications = await prisma.application.findMany({
      where,
      include: {
        job: { include: { company: { select: { id: true, name: true, slug: true, logoUrl: true } } } },
        internship: { include: { company: { select: { id: true, name: true, slug: true, logoUrl: true } } } },
        resume: { select: { id: true, title: true } },
        events: { orderBy: { occurredAt: 'desc' }, take: 10 },
      },
      orderBy: { appliedAt: 'desc' },
    });
    return success(res, applications);
  } catch (err) {
    next(err);
  }
});

router.get('/analytics', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub;
    const apps = await prisma.application.findMany({ where: { userId }, select: { status: true } });
    const byStatus: Record<string, number> = {};
    for (const a of apps) byStatus[a.status] = (byStatus[a.status] ?? 0) + 1;
    return success(res, {
      total: apps.length,
      byStatus,
      active: apps.filter((a) => !['rejected', 'archived', 'withdrawn'].includes(a.status)).length,
      offers: byStatus['offer_received'] ?? 0,
      interviews: (byStatus['interview_scheduled'] ?? 0) + (byStatus['assessment'] ?? 0),
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', validate(idParam, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const app = await prisma.application.findFirst({
      where: { id: String(req.params.id), userId: req.user!.sub },
      include: {
        job: { include: { company: true } },
        internship: { include: { company: true } },
        resume: true,
        events: { orderBy: { occurredAt: 'desc' } },
      },
    });
    if (!app) throw new NotFoundError('Application');
    return success(res, app);
  } catch (err) {
    next(err);
  }
});

router.post('/', validate(createApplicationSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jobId, internshipId, resumeId, coverLetter, notes } = req.body;

    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId: req.user!.sub, deletedAt: null },
    });
    if (!resume) throw new NotFoundError('Resume');

    if (jobId) {
      const job = await prisma.job.findFirst({ where: { id: jobId, status: 'active', deletedAt: null } });
      if (!job) throw new NotFoundError('Job');
    }
    if (internshipId) {
      const intern = await prisma.internship.findFirst({ where: { id: internshipId, status: 'active', deletedAt: null } });
      if (!intern) throw new NotFoundError('Internship');
    }

    const application = await prisma.application.create({
      data: {
        userId: req.user!.sub,
        jobId: jobId ?? null,
        internshipId: internshipId ?? null,
        resumeId,
        resumeSnapshot: resume.content as object,
        coverLetter: coverLetter ?? null,
        notes: notes ?? null,
        status: 'submitted',
        events: {
          create: { status: 'submitted', title: 'Application submitted', notes: notes ?? undefined },
        },
      },
      include: {
        job: { include: { company: { select: { id: true, name: true, slug: true, logoUrl: true } } } },
        internship: { include: { company: { select: { id: true, name: true, slug: true, logoUrl: true } } } },
        events: true,
      },
    });

    if (jobId) {
      await prisma.job.update({ where: { id: jobId }, data: { applicationCount: { increment: 1 } } });
    }
    if (internshipId) {
      await prisma.internship.update({ where: { id: internshipId }, data: { applicationCount: { increment: 1 } } });
    }

    return success(res, application, undefined, 201);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', validate(idParam, 'params'), validate(updateApplicationSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.application.findFirst({
      where: { id: String(req.params.id), userId: req.user!.sub },
    });
    if (!existing) throw new NotFoundError('Application');

    const { status, notes, interviewAt, reminderAt } = req.body;
    const data: Record<string, unknown> = {};
    if (notes !== undefined) data.notes = notes;
    if (interviewAt !== undefined) data.interviewAt = interviewAt ? new Date(interviewAt) : null;
    if (reminderAt !== undefined) data.reminderAt = reminderAt ? new Date(reminderAt) : null;
    if (status) {
      data.status = status as ApplicationStatus;
      data.statusChangedAt = new Date();
    }

    const application = await prisma.application.update({
      where: { id: existing.id },
      data: {
        ...data,
        ...(status
          ? {
              events: {
                create: {
                  status: status as ApplicationStatus,
                  title: `Status updated to ${status}`,
                  notes: notes ?? undefined,
                },
              },
            }
          : {}),
      },
      include: { events: { orderBy: { occurredAt: 'desc' }, take: 5 } },
    });
    return success(res, application);
  } catch (err) {
    next(err);
  }
});

export default router;
