import { Router, Request, Response, NextFunction } from 'express';
import { ApplicationStatus } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { success } from '../lib/api-response';
import { validate } from '../middleware/validate';
import { authenticate, requireRole } from '../middleware/auth';
import { NotFoundError, ForbiddenError } from '../lib/errors';
import { updateApplicationSchema } from '../schemas/career';

const idParam = z.object({ id: z.string().uuid() });

const router = Router();
router.use(authenticate);
router.use(requireRole('employer', 'admin', 'super_admin'));

async function getEmployerCompanyIds(userId: string): Promise<string[]> {
  const companies = await prisma.company.findMany({
    where: { ownerUserId: userId, deletedAt: null },
    select: { id: true },
  });
  return companies.map((c) => c.id);
}

router.get('/overview', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyIds = await getEmployerCompanyIds(req.user!.sub);
    if (!companyIds.length) {
      return success(res, {
        companies: 0,
        activeJobs: 0,
        activeInternships: 0,
        totalApplications: 0,
        pendingReview: 0,
      });
    }

    const [activeJobs, activeInternships, applications] = await Promise.all([
      prisma.job.count({ where: { companyId: { in: companyIds }, status: 'active', deletedAt: null } }),
      prisma.internship.count({ where: { companyId: { in: companyIds }, status: 'active', deletedAt: null } }),
      prisma.application.findMany({
        where: {
          OR: [
            { job: { companyId: { in: companyIds } } },
            { internship: { companyId: { in: companyIds } } },
          ],
        },
        select: { status: true },
      }),
    ]);

    const byStatus: Record<string, number> = {};
    for (const a of applications) byStatus[a.status] = (byStatus[a.status] ?? 0) + 1;

    return success(res, {
      companies: companyIds.length,
      activeJobs,
      activeInternships,
      totalApplications: applications.length,
      pendingReview: (byStatus['submitted'] ?? 0) + (byStatus['under_review'] ?? 0),
      byStatus,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/jobs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyIds = await getEmployerCompanyIds(req.user!.sub);
    const jobs = await prisma.job.findMany({
      where: { companyId: { in: companyIds }, deletedAt: null },
      include: {
        company: { select: { name: true, slug: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    const internships = await prisma.internship.findMany({
      where: { companyId: { in: companyIds }, deletedAt: null },
      include: {
        company: { select: { name: true, slug: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return success(res, { jobs, internships });
  } catch (err) {
    next(err);
  }
});

router.get('/applications', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyIds = await getEmployerCompanyIds(req.user!.sub);
    const { status, jobId } = req.query as Record<string, string | undefined>;

    const applications = await prisma.application.findMany({
      where: {
        ...(status ? { status: status as ApplicationStatus } : {}),
        ...(jobId ? { jobId } : {}),
        OR: [
          { job: { companyId: { in: companyIds } } },
          { internship: { companyId: { in: companyIds } } },
        ],
      },
      include: {
        user: { select: { id: true, name: true, email: true, college: true, graduationYear: true, skills: true } },
        job: { select: { id: true, title: true, slug: true } },
        internship: { select: { id: true, title: true, slug: true } },
        resume: { select: { id: true, title: true, content: true } },
      },
      orderBy: { appliedAt: 'desc' },
    });
    return success(res, applications);
  } catch (err) {
    next(err);
  }
});

router.patch('/applications/:id', validate(idParam, 'params'), validate(updateApplicationSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyIds = await getEmployerCompanyIds(req.user!.sub);
    const application = await prisma.application.findFirst({
      where: { id: String(req.params.id) },
      include: { job: true, internship: true },
    });
    if (!application) throw new NotFoundError('Application');

    const companyId = application.job?.companyId ?? application.internship?.companyId;
    if (!companyId || !companyIds.includes(companyId)) {
      throw new ForbiddenError('Not authorized to manage this application');
    }

    const { status, employerNotes } = req.body;
    const updated = await prisma.application.update({
      where: { id: application.id },
      data: {
        ...(employerNotes !== undefined ? { employerNotes } : {}),
        ...(status
          ? {
              status: status as ApplicationStatus,
              statusChangedAt: new Date(),
              events: {
                create: {
                  status: status as ApplicationStatus,
                  title: `Employer updated status to ${status}`,
                  notes: employerNotes ?? undefined,
                },
              },
            }
          : {}),
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    return success(res, updated);
  } catch (err) {
    next(err);
  }
});

router.get('/companies', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companies = await prisma.company.findMany({
      where: { ownerUserId: req.user!.sub, deletedAt: null },
      include: {
        _count: { select: { jobs: true, internships: true } },
      },
    });
    return success(res, companies);
  } catch (err) {
    next(err);
  }
});

export default router;
