import { Router, Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { success } from '../../lib/api-response';
import { validate } from '../../middleware/validate';
import { requirePerm } from '../../middleware/admin';
import { logAudit } from '../../lib/audit';

const router = Router();

const SETTING_KEYS = ['logo', 'favicon', 'social', 'contact', 'footer', 'adsense'] as const;

const settingsPatchSchema = z.object({
  logo: z.record(z.unknown()).optional(),
  favicon: z.record(z.unknown()).optional(),
  social: z.record(z.unknown()).optional(),
  contact: z.record(z.unknown()).optional(),
  footer: z.record(z.unknown()).optional(),
  adsense: z.record(z.unknown()).optional(),
});

type SettingKey = (typeof SETTING_KEYS)[number];

function toSettingsMap(rows: { key: string; value: unknown }[]): Record<SettingKey, unknown> {
  const map = {} as Record<SettingKey, unknown>;
  for (const key of SETTING_KEYS) {
    const row = rows.find((r) => r.key === key);
    map[key] = row?.value ?? {};
  }
  return map;
}

router.get('/', requirePerm('settings:read'), async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: [...SETTING_KEYS] } },
    });
    return success(res, toSettingsMap(rows));
  } catch (err) {
    next(err);
  }
});

router.patch('/', requirePerm('settings:write'), validate(settingsPatchSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body as z.infer<typeof settingsPatchSchema>;
    const actorId = req.user!.sub;

    for (const key of SETTING_KEYS) {
      const value = data[key];
      if (value === undefined) continue;

      await prisma.siteSetting.upsert({
        where: { key },
        create: { key, value: value as Prisma.InputJsonValue, updatedBy: actorId },
        update: { value: value as Prisma.InputJsonValue, updatedBy: actorId },
      });
    }

    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: [...SETTING_KEYS] } },
    });

    await logAudit({
      actorId,
      action: 'settings.update',
      entityType: 'site_settings',
      metadata: { keys: Object.keys(data) },
    });

    return success(res, toSettingsMap(rows));
  } catch (err) {
    next(err);
  }
});

export default router;
