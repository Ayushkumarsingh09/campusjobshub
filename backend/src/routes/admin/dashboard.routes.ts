import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import { success } from '../../lib/api-response';
import { requirePerm } from '../../middleware/admin';

const router = Router();

router.get('/', requirePerm('dashboard:view'), async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [
      usersCount,
      jobsActive,
      jobsDraft,
      internshipsCount,
      blogPostsCount,
      companiesCount,
      newsletterSubscribers,
      applicationsCount,
      recentAuditLogs,
    ] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.job.count({ where: { status: 'active', deletedAt: null } }),
      prisma.job.count({ where: { status: 'draft', deletedAt: null } }),
      prisma.internship.count({ where: { deletedAt: null } }),
      prisma.blogPost.count({ where: { deletedAt: null } }),
      prisma.company.count({ where: { deletedAt: null } }),
      prisma.newsletterSubscriber.count({ where: { status: 'active' } }),
      prisma.application.count(),
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { actor: { select: { id: true, name: true, email: true } } },
      }),
    ]);

    return success(res, {
      users: usersCount,
      jobs: { active: jobsActive, draft: jobsDraft },
      internships: internshipsCount,
      blogPosts: blogPostsCount,
      companies: companiesCount,
      newsletterSubscribers,
      applications: applicationsCount,
      recentAuditLogs,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/analytics', requirePerm('analytics:read'), async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [topJobs, topCompanies, usersLast30Days, topSearchTerms] = await Promise.all([
      prisma.job.findMany({
        where: { deletedAt: null, status: 'active' },
        orderBy: { viewCount: 'desc' },
        take: 10,
        select: {
          id: true,
          slug: true,
          title: true,
          viewCount: true,
          company: { select: { name: true } },
        },
      }),
      prisma.company.findMany({
        where: { deletedAt: null },
        orderBy: { jobCount: 'desc' },
        take: 10,
        select: {
          id: true,
          slug: true,
          name: true,
          jobCount: true,
          internshipCount: true,
          logoUrl: true,
        },
      }),
      prisma.user.findMany({
        where: { createdAt: { gte: thirtyDaysAgo }, deletedAt: null },
        select: { createdAt: true },
      }),
      prisma.job.findMany({
        where: { deletedAt: null, viewCount: { gt: 0 } },
        orderBy: { viewCount: 'desc' },
        take: 15,
        select: { title: true, viewCount: true, skills: true },
      }),
    ]);

    const userGrowthMap = new Map<string, number>();
    for (const row of usersLast30Days) {
      const day = row.createdAt.toISOString().slice(0, 10);
      userGrowthMap.set(day, (userGrowthMap.get(day) ?? 0) + 1);
    }

    const userGrowth = Array.from(userGrowthMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const searchPlaceholders = topSearchTerms.flatMap((job) => {
      const terms: { term: string; viewCount: number }[] = [
        { term: job.title, viewCount: job.viewCount },
      ];
      for (const skill of job.skills.slice(0, 2)) {
        terms.push({ term: skill, viewCount: Math.floor(job.viewCount * 0.6) });
      }
      return terms;
    }).slice(0, 10);

    return success(res, {
      topJobs,
      topCompanies,
      userGrowth,
      searchPlaceholders,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
