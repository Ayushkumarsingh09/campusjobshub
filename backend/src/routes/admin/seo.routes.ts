import { Router, Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { success, buildPaginationMeta } from '../../lib/api-response';
import { validate } from '../../middleware/validate';
import { requirePerm } from '../../middleware/admin';
import { logAudit } from '../../lib/audit';
import { calculateSeoScore } from '../../lib/seo-score';
import { NotFoundError, ConflictError } from '../../lib/errors';
import { paginationSchema } from '../../schemas/common';
import { adminParamId } from './helpers';

const router = Router();

const idParamSchema = z.object({ id: z.string().uuid() });

const seoListSchema = paginationSchema.extend({
  search: z.string().optional(),
  minScore: z.coerce.number().int().min(0).max(100).optional(),
});

const seoCreateSchema = z.object({
  path: z.string().min(1).max(500),
  metaTitle: z.string().max(70).optional().nullable(),
  metaDescription: z.string().max(160).optional().nullable(),
  ogTitle: z.string().max(100).optional().nullable(),
  ogDescription: z.string().max(200).optional().nullable(),
  ogImage: z.string().optional().nullable(),
  canonicalUrl: z.string().max(500).optional().nullable(),
  robotsIndex: z.boolean().default(true),
  schemaMarkup: z.record(z.unknown()).optional().nullable(),
});

const seoUpdateSchema = seoCreateSchema.partial().omit({ path: true });

const seoBulkSchema = z.object({
  updates: z.array(
    z.object({
      id: z.string().uuid(),
      metaTitle: z.string().max(70).optional().nullable(),
      metaDescription: z.string().max(160).optional().nullable(),
      ogTitle: z.string().max(100).optional().nullable(),
      ogDescription: z.string().max(200).optional().nullable(),
      ogImage: z.string().optional().nullable(),
      canonicalUrl: z.string().max(500).optional().nullable(),
      robotsIndex: z.boolean().optional(),
      schemaMarkup: z.record(z.unknown()).optional().nullable(),
    })
  ).min(1),
});

function scoreSeoPage(data: {
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: string | null;
  canonicalUrl?: string | null;
}): number {
  return calculateSeoScore({
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    ogImage: data.ogImage,
    canonicalUrl: data.canonicalUrl,
  });
}

router.get('/', requirePerm('seo:read'), validate(seoListSchema, 'query'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, search, minScore } = req.query as unknown as z.infer<typeof seoListSchema>;
    const where: Prisma.SeoPageWhereInput = {};

    if (minScore !== undefined) where.seoScore = { gte: minScore };
    if (search) {
      where.OR = [
        { path: { contains: search, mode: 'insensitive' } },
        { metaTitle: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [pages, total] = await Promise.all([
      prisma.seoPage.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.seoPage.count({ where }),
    ]);

    return success(res, pages, buildPaginationMeta(page, limit, total));
  } catch (err) {
    next(err);
  }
});

router.get('/scan', requirePerm('seo:read'), async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [jobs, blogPosts, companies] = await Promise.all([
      prisma.job.findMany({
        where: { deletedAt: null },
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          metaTitle: true,
          metaDescription: true,
          ogImageUrl: true,
          canonicalUrl: true,
        },
        take: 500,
      }),
      prisma.blogPost.findMany({
        where: { deletedAt: null },
        select: {
          id: true,
          slug: true,
          title: true,
          content: true,
          excerpt: true,
          metaTitle: true,
          metaDescription: true,
          ogImageUrl: true,
          canonicalUrl: true,
        },
        take: 500,
      }),
      prisma.company.findMany({
        where: { deletedAt: null },
        select: {
          id: true,
          slug: true,
          name: true,
          description: true,
          metaTitle: true,
          metaDescription: true,
          ogImageUrl: true,
        },
        take: 500,
      }),
    ]);

    const results = [
      ...jobs.map((job) => ({
        entityType: 'job' as const,
        entityId: job.id,
        path: `/jobs/${job.slug}`,
        title: job.title,
        score: calculateSeoScore({
          title: job.title,
          description: job.description,
          metaTitle: job.metaTitle,
          metaDescription: job.metaDescription,
          ogImage: job.ogImageUrl,
          canonicalUrl: job.canonicalUrl,
        }),
      })),
      ...blogPosts.map((post) => ({
        entityType: 'blog' as const,
        entityId: post.id,
        path: `/blog/${post.slug}`,
        title: post.title,
        score: calculateSeoScore({
          title: post.title,
          content: post.content,
          description: post.excerpt ?? undefined,
          metaTitle: post.metaTitle,
          metaDescription: post.metaDescription,
          ogImage: post.ogImageUrl,
          canonicalUrl: post.canonicalUrl,
        }),
      })),
      ...companies.map((company) => ({
        entityType: 'company' as const,
        entityId: company.id,
        path: `/companies/${company.slug}`,
        title: company.name,
        score: calculateSeoScore({
          title: company.name,
          description: company.description ?? undefined,
          metaTitle: company.metaTitle,
          metaDescription: company.metaDescription,
          ogImage: company.ogImageUrl,
        }),
      })),
    ].sort((a, b) => a.score - b.score);

    const summary = {
      total: results.length,
      averageScore: results.length
        ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
        : 0,
      needsImprovement: results.filter((r) => r.score < 50).length,
      good: results.filter((r) => r.score >= 70).length,
    };

    return success(res, { summary, items: results });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', requirePerm('seo:read'), validate(idParamSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = await prisma.seoPage.findUnique({ where: { id: adminParamId(req) } });
    if (!page) throw new NotFoundError('SEO page');
    return success(res, page);
  } catch (err) {
    next(err);
  }
});

router.post('/', requirePerm('seo:write'), validate(seoCreateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body as z.infer<typeof seoCreateSchema>;
    const existing = await prisma.seoPage.findUnique({ where: { path: data.path } });
    if (existing) throw new ConflictError('SEO page path already exists');

    const seoScore = scoreSeoPage(data);

    const page = await prisma.seoPage.create({
      data: {
        path: data.path,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        ogTitle: data.ogTitle,
        ogDescription: data.ogDescription,
        ogImage: data.ogImage,
        canonicalUrl: data.canonicalUrl,
        robotsIndex: data.robotsIndex,
        schemaMarkup: data.schemaMarkup as Prisma.InputJsonValue | undefined,
        seoScore,
      },
    });

    await logAudit({
      actorId: req.user!.sub,
      action: 'seo.create',
      entityType: 'seo_page',
      entityId: page.id,
      metadata: { path: page.path },
    });

    return success(res, page, undefined, 201);
  } catch (err) {
    next(err);
  }
});

router.patch('/bulk', requirePerm('seo:write'), validate(seoBulkSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { updates } = req.body as z.infer<typeof seoBulkSchema>;
    const results = [];

    for (const item of updates) {
      const existing = await prisma.seoPage.findUnique({ where: { id: item.id } });
      if (!existing) continue;

      const { id, ...data } = item;
      const seoScore = scoreSeoPage({ ...existing, ...data });

      const updated = await prisma.seoPage.update({
        where: { id },
        data: {
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          ogTitle: data.ogTitle,
          ogDescription: data.ogDescription,
          ogImage: data.ogImage,
          canonicalUrl: data.canonicalUrl,
          robotsIndex: data.robotsIndex,
          schemaMarkup: data.schemaMarkup as Prisma.InputJsonValue | undefined,
          seoScore,
        },
      });
      results.push(updated);
    }

    await logAudit({
      actorId: req.user!.sub,
      action: 'seo.bulk_update',
      entityType: 'seo_page',
      metadata: { count: results.length },
    });

    return success(res, { updated: results.length, items: results });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', requirePerm('seo:write'), validate(idParamSchema, 'params'), validate(seoUpdateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.seoPage.findUnique({ where: { id: adminParamId(req) } });
    if (!existing) throw new NotFoundError('SEO page');

    const data = req.body as z.infer<typeof seoUpdateSchema>;
    const seoScore = scoreSeoPage({ ...existing, ...data });

    const page = await prisma.seoPage.update({
      where: { id: adminParamId(req) },
      data: {
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        ogTitle: data.ogTitle,
        ogDescription: data.ogDescription,
        ogImage: data.ogImage,
        canonicalUrl: data.canonicalUrl,
        robotsIndex: data.robotsIndex,
        schemaMarkup: data.schemaMarkup as Prisma.InputJsonValue | undefined,
        seoScore,
      },
    });

    await logAudit({
      actorId: req.user!.sub,
      action: 'seo.update',
      entityType: 'seo_page',
      entityId: page.id,
      metadata: { fields: Object.keys(data) },
    });

    return success(res, page);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requirePerm('seo:write'), validate(idParamSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.seoPage.findUnique({ where: { id: adminParamId(req) } });
    if (!existing) throw new NotFoundError('SEO page');

    await prisma.seoPage.delete({ where: { id: adminParamId(req) } });

    await logAudit({
      actorId: req.user!.sub,
      action: 'seo.delete',
      entityType: 'seo_page',
      entityId: adminParamId(req),
    });

    return success(res, { deleted: true });
  } catch (err) {
    next(err);
  }
});

export default router;
