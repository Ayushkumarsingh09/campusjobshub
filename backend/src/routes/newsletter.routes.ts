import { Router, Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { success } from '../lib/api-response';
import { validate } from '../middleware/validate';

const router = Router();

const subscribeSchema = z.object({
  email: z.string().email().max(255),
  source: z.string().max(50).optional(),
});

router.post('/subscribe', validate(subscribeSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, source } = req.body as z.infer<typeof subscribeSchema>;
    const normalized = email.trim().toLowerCase();

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email: normalized } });
    if (existing) {
      if (existing.status === 'unsubscribed') {
        const subscriber = await prisma.newsletterSubscriber.update({
          where: { id: existing.id },
          data: {
            status: 'pending',
            unsubscribedAt: null,
            source: source ?? existing.source,
          },
        });
        return success(res, { subscribed: true, status: subscriber.status });
      }
      return success(res, { subscribed: true, status: existing.status, message: 'Already subscribed' });
    }

    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email: normalized,
        confirmToken: randomBytes(32).toString('hex'),
        unsubscribeToken: randomBytes(32).toString('hex'),
        source: source ?? 'footer',
      },
    });

    return success(res, { subscribed: true, status: subscriber.status }, undefined, 201);
  } catch (err) {
    next(err);
  }
});

export default router;
