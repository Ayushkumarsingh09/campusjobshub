import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  let dbStatus = 'ok';
  let dataStatus = 'unknown';
  try {
    await prisma.$queryRaw`SELECT 1`;
    const jobCount = await prisma.job.count({ where: { deletedAt: null } });
    dataStatus = jobCount > 0 ? 'seeded' : 'empty';
  } catch {
    dbStatus = 'error';
    dataStatus = 'error';
  }

  res.json({
    success: true,
    data: {
      status: dbStatus === 'ok' && dataStatus !== 'error' ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services: { database: dbStatus, data: dataStatus },
    },
  });
});

export default router;
