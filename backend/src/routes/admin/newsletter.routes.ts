import { Router, Request, Response, NextFunction } from 'express';
import { Prisma, SubscriberStatus } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { success, buildPaginationMeta } from '../../lib/api-response';
import { validate } from '../../middleware/validate';
import { requirePerm } from '../../middleware/admin';
import { logAudit } from '../../lib/audit';
import { logger } from '../../lib/logger';
import { NotFoundError } from '../../lib/errors';
import { paginationSchema } from '../../schemas/common';
import { adminParamId } from './helpers';

const router = Router();

const idParamSchema = z.object({ id: z.string().uuid() });

const subscriberListSchema = paginationSchema.extend({
  search: z.string().optional(),
  status: z.nativeEnum(SubscriberStatus).optional(),
});

const subscriberUpdateSchema = z.object({
  status: z.nativeEnum(SubscriberStatus),
  preferences: z.record(z.boolean()).optional(),
});

const sendTestSchema = z.object({
  subject: z.string().min(1).max(200),
  body: z.string().min(1),
  email: z.string().email().optional(),
});

router.get('/', requirePerm('newsletter:read'), validate(subscriberListSchema, 'query'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, search, status } = req.query as unknown as z.infer<typeof subscriberListSchema>;
    const where: Prisma.NewsletterSubscriberWhereInput = {};

    if (status) where.status = status;
    if (search) {
      where.email = { contains: search, mode: 'insensitive' };
    }

    const [subscribers, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.newsletterSubscriber.count({ where }),
    ]);

    return success(res, subscribers, buildPaginationMeta(page, limit, total));
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', requirePerm('newsletter:write'), validate(idParamSchema, 'params'), validate(subscriberUpdateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { id: adminParamId(req) } });
    if (!existing) throw new NotFoundError('Subscriber');

    const data = req.body as z.infer<typeof subscriberUpdateSchema>;
    const updateData: Prisma.NewsletterSubscriberUpdateInput = {
      status: data.status,
      preferences: data.preferences,
    };

    if (data.status === 'active' && existing.status !== 'active') {
      updateData.confirmedAt = new Date();
    }
    if (data.status === 'unsubscribed') {
      updateData.unsubscribedAt = new Date();
    }

    const subscriber = await prisma.newsletterSubscriber.update({
      where: { id: adminParamId(req) },
      data: updateData,
    });

    await logAudit({
      actorId: req.user!.sub,
      action: 'newsletter.subscriber.update',
      entityType: 'newsletter_subscriber',
      entityId: subscriber.id,
      metadata: { status: data.status },
    });

    return success(res, subscriber);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requirePerm('newsletter:write'), validate(idParamSchema, 'params'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { id: adminParamId(req) } });
    if (!existing) throw new NotFoundError('Subscriber');

    await prisma.newsletterSubscriber.delete({ where: { id: adminParamId(req) } });

    await logAudit({
      actorId: req.user!.sub,
      action: 'newsletter.subscriber.delete',
      entityType: 'newsletter_subscriber',
      entityId: adminParamId(req),
    });

    return success(res, { deleted: true });
  } catch (err) {
    next(err);
  }
});

router.post('/send-test', requirePerm('newsletter:write'), validate(sendTestSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subject, body, email } = req.body as z.infer<typeof sendTestSchema>;

    logger.info(
      {
        actorId: req.user!.sub,
        subject,
        bodyPreview: body.slice(0, 100),
        recipient: email ?? 'admin-test@campusjobshub.com',
      },
      'Newsletter test email (not sent — log only)'
    );

    await logAudit({
      actorId: req.user!.sub,
      action: 'newsletter.send_test',
      entityType: 'newsletter',
      metadata: { subject, recipient: email },
    });

    return success(res, { sent: false, logged: true, message: 'Test email logged (no mailer configured)' });
  } catch (err) {
    next(err);
  }
});

export default router;
