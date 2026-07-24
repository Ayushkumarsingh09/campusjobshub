import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { success } from '../lib/api-response';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { NotFoundError } from '../lib/errors';
import { atsScanSchema } from '../schemas/career';
import { runAtsScan } from '../lib/career/ats-engine';
import type { ResumeContent } from '../lib/career/resume-types';
import { EMPTY_RESUME_CONTENT } from '../lib/career/resume-types';

const router = Router();
router.use(authenticate);

router.get('/history', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reports = await prisma.atsReport.findMany({
      where: { userId: req.user!.sub },
      include: { resume: { select: { id: true, title: true } }, job: { select: { id: true, title: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return success(res, reports);
  } catch (err) {
    next(err);
  }
});

router.post('/scan', validate(atsScanSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { resumeId, content, jobDescription, jobId } = req.body;
    let resumeContent: ResumeContent = content ?? EMPTY_RESUME_CONTENT;
    let resolvedResumeId = resumeId as string | undefined;

    if (resumeId) {
      const resume = await prisma.resume.findFirst({
        where: { id: resumeId, userId: req.user!.sub, deletedAt: null },
      });
      if (!resume) throw new NotFoundError('Resume');
      resumeContent = (content ?? resume.content) as unknown as ResumeContent;
      resolvedResumeId = resume.id;
    }

    if (!resolvedResumeId) {
      const primary = await prisma.resume.findFirst({
        where: { userId: req.user!.sub, deletedAt: null, isPrimary: true },
      });
      if (primary) {
        resolvedResumeId = primary.id;
        if (!content) resumeContent = primary.content as unknown as ResumeContent;
      } else {
        const anyResume = await prisma.resume.create({
          data: {
            userId: req.user!.sub,
            title: 'ATS Scan Draft',
            content: resumeContent as object,
            isPrimary: true,
          },
        });
        resolvedResumeId = anyResume.id;
      }
    }

    const result = runAtsScan(resumeContent, jobDescription);

    const report = await prisma.atsReport.create({
      data: {
        resumeId: resolvedResumeId!,
        userId: req.user!.sub,
        jobId: jobId ?? null,
        jobDescriptionText: jobDescription ?? null,
        overallScore: result.overallScore,
        keywordScore: result.keywordScore,
        formattingScore: result.formattingScore,
        matchDetails: result.matchDetails,
        suggestions: result.suggestions,
      },
    });

    return success(res, { ...result, reportId: report.id, createdAt: report.createdAt });
  } catch (err) {
    next(err);
  }
});

export default router;
