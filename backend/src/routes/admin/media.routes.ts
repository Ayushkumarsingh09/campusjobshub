import { Router, Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { success, buildPaginationMeta } from '../../lib/api-response';
import { validate } from '../../middleware/validate';
import { requirePerm } from '../../middleware/admin';
import { logAudit } from '../../lib/audit';
import { getUploadSignature, deleteCloudinaryAsset, generateAltText } from '../../lib/cloudinary';
import { NotFoundError } from '../../lib/errors';
import { paginationSchema } from '../../schemas/common';
import { adminParamId } from './helpers';

const router = Router();

const idParamSchema = z.object({ id: z.string().uuid() });

const mediaListSchema = paginationSchema.extend({
  search: z.string().optional(),
  category: z.string().optional(),
});

const uploadSignatureSchema = z.object({
  folder: z.string().max(100).default('campusjobs'),
});

const mediaCreateSchema = z.object({
  publicId: z.string().min(1).max(255),
  url: z.string().url(),
  secureUrl: z.string().url(),
  format: z.string().max(20).optional().nullable(),
  width: z.number().int().optional().nullable(),
  height: z.number().int().optional().nullable(),
  bytes: z.number().int().optional().nullable(),
  altText: z.string().max(255).optional().nullable(),
  category: z.string().max(50).default('general'),
  filename: z.string().optional(),
});

router.get('/', requirePerm('media:read'), validate(mediaListSchema, 'query'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, search, category } = req.query as unknown as z.infer<typeof mediaListSchema>;
    const where: Prisma.MediaAssetWhereInput = {};

    if (category) where.category = category;
    if (search) {
      where.OR = [
        { publicId: { contains: search, mode: 'insensitive' } },
        { altText: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [assets, total] = await Promise.all([
      prisma.mediaAsset.findMany({
        where,
        include: { uploadedBy: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.mediaAsset.count({ where }),
    ]);

    return success(res, assets, buildPaginationMeta(page, limit, total));
  } catch (err) {
    next(err);
  }
});

router.post('/upload-signature', requirePerm('media:write'), validate(uploadSignatureSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { folder } = req.body as z.infer<typeof uploadSignatureSchema>;
    const signature = getUploadSignature(folder);
    return success(res, signature);
  } catch (err) {
    next(err);
  }
});

router.post('/', requirePerm('media:write'), validate(mediaCreateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body as z.infer<typeof mediaCreateSchema>;
    const altText = data.altText ?? generateAltText(data.filename ?? data.publicId, data.category);

    const asset = await prisma.mediaAsset.create({
      data: {
        publicId: data.publicId,
        url: data.url,
        secureUrl: data.secureUrl,
        format: data.format,
        width: data.width,
        height: data.height,
        bytes: data.bytes,
        altText,
        category: data.category,
        uploadedById: req.user!.sub,
      },
      include: { uploadedBy: { select: { id: true, name: true } } },
    });

    await logAudit({
      actorId: req.user!.sub,
      action: 'media.create',
      entityType: 'media_asset',
      entityId: asset.id,
      metadata: { publicId: asset.publicId },
    });

    return success(res, asset, undefined, 201);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requirePerm('media:delete'), validate(idParamSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.mediaAsset.findUnique({ where: { id: adminParamId(req) } });
    if (!existing) throw new NotFoundError('Media asset');

    try {
      await deleteCloudinaryAsset(existing.publicId);
    } catch {
      // continue even if cloudinary delete fails
    }

    await prisma.mediaAsset.delete({ where: { id: adminParamId(req) } });

    await logAudit({
      actorId: req.user!.sub,
      action: 'media.delete',
      entityType: 'media_asset',
      entityId: adminParamId(req),
      metadata: { publicId: existing.publicId },
    });

    return success(res, { deleted: true });
  } catch (err) {
    next(err);
  }
});

export default router;
