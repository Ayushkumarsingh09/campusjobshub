import { Router, Request, Response, NextFunction } from 'express';
import { Prisma, UserRole } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { success, buildPaginationMeta } from '../../lib/api-response';
import { validate } from '../../middleware/validate';
import { requirePerm } from '../../middleware/admin';
import { logAudit } from '../../lib/audit';
import { canChangeRole } from '../../lib/permissions';
import { NotFoundError, ForbiddenError } from '../../lib/errors';
import { paginationSchema } from '../../schemas/common';
import { adminParamId } from './helpers';

const router = Router();

const idParamSchema = z.object({ id: z.string().uuid() });

const userListSchema = paginationSchema.extend({
  search: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  isActive: z.coerce.boolean().optional(),
});

const userUpdateSchema = z.object({
  role: z.nativeEnum(UserRole).optional(),
  isActive: z.boolean().optional(),
  name: z.string().min(2).max(150).optional(),
  phone: z.string().max(20).optional().nullable(),
  college: z.string().max(200).optional().nullable(),
  graduationYear: z.number().int().min(2000).max(2100).optional().nullable(),
  bio: z.string().optional().nullable(),
});

router.get('/', requirePerm('users:read'), validate(userListSchema, 'query'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, search, role, isActive } = req.query as unknown as z.infer<typeof userListSchema>;
    const where: Prisma.UserWhereInput = { deletedAt: null };

    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { college: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatarUrl: true,
          college: true,
          graduationYear: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return success(res, users, buildPaginationMeta(page, limit, total));
  } catch (err) {
    next(err);
  }
});

router.get('/:id', requirePerm('users:read'), validate(idParamSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: adminParamId(req), deletedAt: null },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        phone: true,
        college: true,
        graduationYear: true,
        bio: true,
        profileCompletion: true,
        isActive: true,
        emailVerifiedAt: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { applications: true, blogPosts: true, companies: true },
        },
      },
    });
    if (!user) throw new NotFoundError('User');
    return success(res, user);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', requirePerm('users:write'), validate(idParamSchema, 'params'), validate(userUpdateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.user.findFirst({ where: { id: adminParamId(req), deletedAt: null } });
    if (!existing) throw new NotFoundError('User');

    const data = req.body as z.infer<typeof userUpdateSchema>;
    const actorRole = req.user!.role as UserRole;

    if (data.role && !canChangeRole(actorRole, data.role)) {
      throw new ForbiddenError('Cannot assign this role');
    }
    if (adminParamId(req) === req.user!.sub && data.role && data.role !== existing.role) {
      throw new ForbiddenError('Cannot change your own role');
    }
    if (adminParamId(req) === req.user!.sub && data.isActive === false) {
      throw new ForbiddenError('Cannot deactivate your own account');
    }

    const user = await prisma.user.update({
      where: { id: adminParamId(req) },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    await logAudit({
      actorId: req.user!.sub,
      action: 'user.update',
      entityType: 'user',
      entityId: user.id,
      metadata: { fields: Object.keys(data) },
    });

    return success(res, user);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requirePerm('users:delete'), validate(idParamSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (adminParamId(req) === req.user!.sub) {
      throw new ForbiddenError('Cannot delete your own account');
    }

    const existing = await prisma.user.findFirst({ where: { id: adminParamId(req), deletedAt: null } });
    if (!existing) throw new NotFoundError('User');

    if (!canChangeRole(req.user!.role as UserRole, existing.role)) {
      throw new ForbiddenError('Cannot delete this user');
    }

    await prisma.user.update({
      where: { id: adminParamId(req) },
      data: { deletedAt: new Date(), isActive: false },
    });

    await logAudit({
      actorId: req.user!.sub,
      action: 'user.delete',
      entityType: 'user',
      entityId: adminParamId(req),
    });

    return success(res, { deleted: true });
  } catch (err) {
    next(err);
  }
});

export default router;
