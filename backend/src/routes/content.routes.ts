import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { success } from '../lib/api-response';
import { validate } from '../middleware/validate';
import { getRelatedContent, type RelatedContentType } from '../lib/content/related-content';
import { scoreContentQuality } from '../lib/content/quality-score';
import { slugify, generateJobSlug, generateBlogSlug } from '../lib/content/slug-generator';

const relatedSchema = z.object({
  type: z.enum(['blog', 'job', 'internship', 'company', 'roadmap', 'interview']),
  slug: z.string().min(1),
  limit: z.coerce.number().int().min(1).max(12).optional().default(6),
});

const scoreSchema = z.object({
  title: z.string().min(1),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  content: z.string().min(1),
  faqCount: z.coerce.number().optional(),
  internalLinkCount: z.coerce.number().optional(),
  hasFeaturedImage: z.coerce.boolean().optional(),
  hasAuthor: z.coerce.boolean().optional(),
});

const slugSchema = z.object({
  text: z.string().min(1),
  type: z.enum(['job', 'blog', 'generic']).optional().default('generic'),
  company: z.string().optional(),
  city: z.string().optional(),
});

const router = Router();

router.get(
  '/related',
  validate(relatedSchema, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type, slug, limit } = req.query as Record<string, string | number>;
      const items = await getRelatedContent(
        prisma,
        type as RelatedContentType,
        String(slug),
        Number(limit)
      );
      return success(res, items);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/score',
  validate(scoreSchema, 'body'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = scoreContentQuality(req.body);
      return success(res, result);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  '/slug',
  validate(slugSchema, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { text, type, company, city } = req.query as Record<string, string | undefined>;

      let slug: string;
      const slugType = (type ?? 'generic') as 'job' | 'blog' | 'generic';
      if (slugType === 'job' && company) {
        slug = generateJobSlug(String(text), company, city);
      } else if (slugType === 'blog') {
        slug = generateBlogSlug(String(text));
      } else {
        slug = slugify(String(text));
      }

      return success(res, { slug, text, type: slugType });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
