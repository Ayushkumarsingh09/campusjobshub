import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { success } from '../lib/api-response';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { NotFoundError } from '../lib/errors';
import { coverLetterGenerateSchema } from '../schemas/career';
import { generateCoverLetter } from '../lib/career/cover-letter-engine';
import type { ResumeContent } from '../lib/career/resume-types';
import { EMPTY_RESUME_CONTENT } from '../lib/career/resume-types';

const idParam = z.object({ id: z.string().uuid() });

const router = Router();
router.use(authenticate);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const letters = await prisma.coverLetter.findMany({
      where: { userId: req.user!.sub },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return success(res, letters);
  } catch (err) {
    next(err);
  }
});

router.post('/generate', validate(coverLetterGenerateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { resumeId, jobTitle, companyName, jobDescription, style } = req.body;
    let content: ResumeContent = EMPTY_RESUME_CONTENT;

    if (resumeId) {
      const resume = await prisma.resume.findFirst({
        where: { id: resumeId, userId: req.user!.sub, deletedAt: null },
      });
      if (!resume) throw new NotFoundError('Resume');
      content = resume.content as unknown as ResumeContent;
    } else {
      const primary = await prisma.resume.findFirst({
        where: { userId: req.user!.sub, deletedAt: null, isPrimary: true },
      });
      if (primary) content = primary.content as unknown as ResumeContent;
    }

    const letterContent = generateCoverLetter({
      style,
      resume: content,
      jobTitle,
      companyName,
      jobDescription,
    });

    const saved = await prisma.coverLetter.create({
      data: {
        userId: req.user!.sub,
        resumeId: resumeId ?? null,
        jobTitle,
        companyName,
        jobDescription: jobDescription ?? null,
        style,
        content: letterContent,
      },
    });

    return success(res, { content: letterContent, id: saved.id }, undefined, 201);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', validate(idParam, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const letter = await prisma.coverLetter.findFirst({
      where: { id: String(req.params.id), userId: req.user!.sub },
    });
    if (!letter) throw new NotFoundError('Cover letter');
    return success(res, letter);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', validate(idParam, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const letter = await prisma.coverLetter.findFirst({
      where: { id: String(req.params.id), userId: req.user!.sub },
    });
    if (!letter) throw new NotFoundError('Cover letter');
    await prisma.coverLetter.delete({ where: { id: letter.id } });
    return success(res, { deleted: true });
  } catch (err) {
    next(err);
  }
});

export default router;
