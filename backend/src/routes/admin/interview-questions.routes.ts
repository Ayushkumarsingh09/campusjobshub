import { Router, Request, Response, NextFunction } from 'express';
import { DifficultyLevel, Prisma } from '@prisma/client';
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

const questionListSchema = paginationSchema.extend({
  search: z.string().optional(),
  topic: z.string().optional(),
  difficulty: z.nativeEnum(DifficultyLevel).optional(),
  companyId: z.string().uuid().optional(),
  isPublished: z.coerce.boolean().optional(),
});

const questionCreateSchema = z.object({
  question: z.string().min(10),
  answer: z.string().min(20),
  companyId: z.string().uuid().optional().nullable(),
  role: z.string().max(100).optional().nullable(),
  difficulty: z.nativeEnum(DifficultyLevel).default('medium'),
  topic: z.string().max(100).optional().nullable(),
  isPublished: z.boolean().default(true),
  tagIds: z.array(z.string().uuid()).default([]),
  metaTitle: z.string().max(70).optional().nullable(),
  metaDescription: z.string().max(160).optional().nullable(),
});

const questionUpdateSchema = questionCreateSchema.partial();

async function ensureUniqueSlug(base: string, excludeId?: string): Promise<string> {
  const truncated = base.slice(0, 80);
  let counter = 0;
  while (counter < 100) {
    const candidate = counter === 0 ? slugify(truncated) : uniqueSlug(truncated, String(counter));
    const existing = await prisma.interviewQuestion.findFirst({
      where: { slug: candidate, ...(excludeId ? { id: { not: excludeId } } : {}) },
    });
    if (!existing) return candidate;
    counter++;
  }
  return uniqueSlug(truncated, Date.now().toString());
}

async function syncTags(interviewQuestionId: string, tagIds: string[]) {
  await prisma.interviewQuestionTag.deleteMany({ where: { interviewQuestionId } });
  if (tagIds.length) {
    await prisma.interviewQuestionTag.createMany({
      data: tagIds.map((tagId) => ({ interviewQuestionId, tagId })),
    });
  }
}

router.get('/', requirePerm('interview:read'), validate(questionListSchema, 'query'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, search, topic, difficulty, companyId, isPublished } = req.query as unknown as z.infer<typeof questionListSchema>;
    const where: Prisma.InterviewQuestionWhereInput = {};

    if (topic) where.topic = { equals: topic, mode: 'insensitive' };
    if (difficulty) where.difficulty = difficulty;
    if (companyId) where.companyId = companyId;
    if (isPublished !== undefined) where.isPublished = isPublished;
    if (search) {
      where.OR = [
        { question: { contains: search, mode: 'insensitive' } },
        { answer: { contains: search, mode: 'insensitive' } },
        { topic: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [questions, total] = await Promise.all([
      prisma.interviewQuestion.findMany({
        where,
        include: {
          company: { select: { id: true, name: true, slug: true } },
          tags: { include: { tag: true } },
        },
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.interviewQuestion.count({ where }),
    ]);

    return success(res, questions, buildPaginationMeta(page, limit, total));
  } catch (err) {
    next(err);
  }
});

router.get('/:id', requirePerm('interview:read'), validate(idParamSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const question = await prisma.interviewQuestion.findUnique({
      where: { id: adminParamId(req) },
      include: {
        company: true,
        tags: { include: { tag: true } },
      },
    });
    if (!question) throw new NotFoundError('Interview question');
    return success(res, question);
  } catch (err) {
    next(err);
  }
});

router.post('/', requirePerm('interview:write'), validate(questionCreateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body as z.infer<typeof questionCreateSchema>;
    const { tagIds, ...questionData } = data;
    const slug = await ensureUniqueSlug(data.question);

    const question = await prisma.interviewQuestion.create({
      data: { ...questionData, slug, companyId: questionData.companyId ?? undefined },
      include: { company: true, tags: { include: { tag: true } } },
    });

    if (tagIds.length) await syncTags(question.id, tagIds);

    await logAudit({
      actorId: req.user!.sub,
      action: 'interview_question.create',
      entityType: 'interview_question',
      entityId: question.id,
    });

    return success(res, question, undefined, 201);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', requirePerm('interview:write'), validate(idParamSchema, 'params'), validate(questionUpdateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.interviewQuestion.findUnique({ where: { id: adminParamId(req) } });
    if (!existing) throw new NotFoundError('Interview question');

    const data = req.body as z.infer<typeof questionUpdateSchema>;
    const { tagIds, question: questionText, ...questionData } = data;

    const updateData: Prisma.InterviewQuestionUpdateInput = { ...questionData };
    if (questionText) {
      updateData.question = questionText;
      if (questionText !== existing.question) {
        updateData.slug = await ensureUniqueSlug(questionText, existing.id);
      }
    }

    const question = await prisma.interviewQuestion.update({
      where: { id: adminParamId(req) },
      data: updateData,
      include: { company: true, tags: { include: { tag: true } } },
    });

    if (tagIds) await syncTags(question.id, tagIds);

    await logAudit({
      actorId: req.user!.sub,
      action: 'interview_question.update',
      entityType: 'interview_question',
      entityId: question.id,
      metadata: { fields: Object.keys(data) },
    });

    return success(res, question);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requirePerm('interview:delete'), validate(idParamSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.interviewQuestion.findUnique({ where: { id: adminParamId(req) } });
    if (!existing) throw new NotFoundError('Interview question');

    await prisma.interviewQuestion.delete({ where: { id: adminParamId(req) } });

    await logAudit({
      actorId: req.user!.sub,
      action: 'interview_question.delete',
      entityType: 'interview_question',
      entityId: adminParamId(req),
    });

    return success(res, { deleted: true });
  } catch (err) {
    next(err);
  }
});

export default router;
