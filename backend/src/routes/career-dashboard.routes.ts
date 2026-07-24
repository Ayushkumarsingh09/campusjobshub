import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { success } from '../lib/api-response';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { updateProfileSchema, skillGapSchema, roadmapProgressSchema } from '../schemas/career';
import { calculateProfileCompletion } from '../lib/career/profile-completion';
import { generateRecommendations } from '../lib/career/recommendation-engine';
import { analyzeSkillGap, AVAILABLE_TARGET_ROLES } from '../lib/career/skill-gap-engine';
import type { ResumeContent } from '../lib/career/resume-types';
const router = Router();
router.use(authenticate);

router.get('/overview', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub;
    const [user, applicationCount, savedJobCount, savedCompanyCount, resumeCount, latestAts, roadmapProgress] =
      await Promise.all([
        prisma.user.findUnique({ where: { id: userId } }),
        prisma.application.count({ where: { userId } }),
        prisma.savedJob.count({ where: { userId } }),
        prisma.savedCompany.count({ where: { userId } }),
        prisma.resume.count({ where: { userId, deletedAt: null } }),
        prisma.atsReport.findFirst({ where: { userId }, orderBy: { createdAt: 'desc' } }),
        prisma.roadmapProgress.findMany({
          where: { userId },
          include: { roadmap: { select: { slug: true, title: true, topic: true } } },
          take: 5,
        }),
      ]);

    if (!user) return next(new Error('User not found'));

    const recentApplications = await prisma.application.findMany({
      where: { userId },
      include: {
        job: { select: { title: true, slug: true, company: { select: { name: true } } } },
        internship: { select: { title: true, slug: true, company: { select: { name: true } } } },
      },
      orderBy: { appliedAt: 'desc' },
      take: 5,
    });

    const primaryResume = await prisma.resume.findFirst({
      where: { userId, deletedAt: null, isPrimary: true },
    });

    const recommendations = await generateRecommendations(prisma, {
      skills: user.skills,
      interests: user.interests,
      targetRole: user.targetRole,
      resumeContent: primaryResume?.content as ResumeContent | null,
      education: { college: user.college, graduationYear: user.graduationYear },
    });

    const skillGap = user.targetRole
      ? analyzeSkillGap(user.targetRole, user.skills)
      : null;

    return success(res, {
      stats: {
        applications: applicationCount,
        savedJobs: savedJobCount,
        savedCompanies: savedCompanyCount,
        resumes: resumeCount,
        atsScore: latestAts?.overallScore ?? null,
        profileCompletion: user.profileCompletion,
      },
      recentApplications,
      roadmapProgress,
      recommendations: {
        jobs: recommendations.recommendedJobs.slice(0, 4),
        roadmaps: recommendations.recommendedRoadmaps.slice(0, 3),
        skills: recommendations.recommendedSkills.slice(0, 5),
      },
      skillGap: skillGap
        ? { matchPercent: skillGap.matchPercent, missingSkills: skillGap.missingSkills.slice(0, 5) }
        : null,
    });
  } catch (err) {
    next(err);
  }
});

router.patch('/profile', validate(updateProfileSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub;
    const data = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.college !== undefined ? { college: data.college } : {}),
        ...(data.graduationYear !== undefined ? { graduationYear: data.graduationYear } : {}),
        ...(data.bio !== undefined ? { bio: data.bio } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
        ...(data.skills !== undefined ? { skills: data.skills } : {}),
        ...(data.interests !== undefined ? { interests: data.interests } : {}),
        ...(data.targetRole !== undefined ? { targetRole: data.targetRole } : {}),
      },
    });

    const [resumeCount, applicationCount] = await Promise.all([
      prisma.resume.count({ where: { userId, deletedAt: null } }),
      prisma.application.count({ where: { userId } }),
    ]);

    const profileCompletion = calculateProfileCompletion({
      name: user.name,
      college: user.college,
      graduationYear: user.graduationYear,
      bio: user.bio,
      phone: user.phone,
      skills: user.skills,
      targetRole: user.targetRole,
      resumeCount,
      applicationCount,
    });

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { profileCompletion },
    });

    return success(res, {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      college: updated.college,
      graduationYear: updated.graduationYear,
      bio: updated.bio,
      phone: updated.phone,
      skills: updated.skills,
      interests: updated.interests,
      targetRole: updated.targetRole,
      profileCompletion: updated.profileCompletion,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/recommendations', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.sub } });
    if (!user) return next(new Error('User not found'));

    const primaryResume = await prisma.resume.findFirst({
      where: { userId: user.id, isPrimary: true, deletedAt: null },
    });

    const recs = await generateRecommendations(prisma, {
      skills: user.skills,
      interests: user.interests,
      targetRole: user.targetRole,
      resumeContent: primaryResume?.content as ResumeContent | null,
    });
    return success(res, recs);
  } catch (err) {
    next(err);
  }
});

router.get('/skill-gap/roles', (_req: Request, res: Response) => {
  return success(res, AVAILABLE_TARGET_ROLES);
});

router.post('/skill-gap', validate(skillGapSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.sub } });
    const currentSkills = req.body.currentSkills ?? user?.skills ?? [];
    const result = analyzeSkillGap(req.body.targetRole, currentSkills);

    const report = await prisma.skillGapReport.create({
      data: {
        userId: req.user!.sub,
        targetRole: result.targetRole,
        currentSkills: result.currentSkills,
        targetSkills: result.targetSkills,
        missingSkills: result.missingSkills,
        learningPlan: result.learningPlan,
        roadmapSlugs: result.roadmapSlugs,
        matchPercent: result.matchPercent,
      },
    });

    if (user && !user.targetRole) {
      await prisma.user.update({ where: { id: user.id }, data: { targetRole: result.targetRole } });
    }

    return success(res, { ...result, reportId: report.id });
  } catch (err) {
    next(err);
  }
});

router.get('/skill-gap/history', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reports = await prisma.skillGapReport.findMany({
      where: { userId: req.user!.sub },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    return success(res, reports);
  } catch (err) {
    next(err);
  }
});

router.post('/roadmap-progress', validate(roadmapProgressSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roadmapId, completedSteps } = req.body;
    const roadmap = await prisma.careerRoadmap.findUnique({
      where: { id: roadmapId },
      include: { steps: true },
    });
    if (!roadmap) return next(new Error('Roadmap not found'));

    const total = roadmap.steps.length || 1;
    const progressPercent = Math.round((completedSteps.length / total) * 100);

    const progress = await prisma.roadmapProgress.upsert({
      where: { userId_roadmapId: { userId: req.user!.sub, roadmapId } },
      update: { completedSteps, progressPercent },
      create: { userId: req.user!.sub, roadmapId, completedSteps, progressPercent },
      include: { roadmap: { select: { slug: true, title: true } } },
    });
    return success(res, progress);
  } catch (err) {
    next(err);
  }
});

router.get('/roadmap-progress', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const progress = await prisma.roadmapProgress.findMany({
      where: { userId: req.user!.sub },
      include: { roadmap: { select: { slug: true, title: true, topic: true } } },
    });
    return success(res, progress);
  } catch (err) {
    next(err);
  }
});

export default router;
