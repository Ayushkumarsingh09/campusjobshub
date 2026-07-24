import type { PrismaClient } from '@prisma/client';
import type { ResumeContent } from './resume-types';
import { extractSkillsFromResume } from './resume-types';

export const ROLE_CAREERS: Record<string, { careers: string[]; skills: string[] }> = {
  'software engineer': {
    careers: ['Backend Developer', 'Full Stack Engineer', 'Platform Engineer'],
    skills: ['java', 'python', 'javascript', 'sql', 'git', 'data structures', 'system design'],
  },
  'frontend developer': {
    careers: ['React Developer', 'UI Engineer', 'Web Developer'],
    skills: ['javascript', 'react', 'html', 'css', 'typescript', 'responsive design'],
  },
  'data scientist': {
    careers: ['ML Engineer', 'Data Analyst', 'AI Research Associate'],
    skills: ['python', 'sql', 'machine learning', 'statistics', 'pandas', 'tensorflow'],
  },
  'devops engineer': {
    careers: ['Cloud Engineer', 'SRE', 'Platform Engineer'],
    skills: ['linux', 'docker', 'kubernetes', 'aws', 'ci/cd', 'terraform'],
  },
  'product analyst': {
    careers: ['Business Analyst', 'Product Manager', 'Growth Analyst'],
    skills: ['sql', 'excel', 'analytics', 'communication', 'problem solving'],
  },
};

function normalizeSkill(s: string): string {
  return s.toLowerCase().trim();
}

function skillOverlap(userSkills: string[], targetSkills: string[]): number {
  const userSet = new Set(userSkills.map(normalizeSkill));
  const matches = targetSkills.filter((s) => {
    const n = normalizeSkill(s);
    return [...userSet].some((u) => u.includes(n) || n.includes(u));
  });
  return targetSkills.length ? matches.length / targetSkills.length : 0;
}

export interface CareerRecommendations {
  recommendedCareers: { role: string; matchPercent: number; reason: string }[];
  recommendedJobs: Awaited<ReturnType<typeof fetchJobMatches>>;
  recommendedRoadmaps: { slug: string; title: string; topic: string | null; matchPercent: number }[];
  recommendedSkills: string[];
}

async function fetchJobMatches(
  prisma: PrismaClient,
  userSkills: string[],
  limit: number
) {
  const jobs = await prisma.job.findMany({
    where: { status: 'active', deletedAt: null, expiresAt: { gt: new Date() } },
    include: { company: { select: { id: true, name: true, slug: true, logoUrl: true } } },
    orderBy: { publishedAt: 'desc' },
    take: 80,
  });

  return jobs
    .map((job) => {
      const overlap = skillOverlap(userSkills, job.skills);
      return {
        id: job.id,
        slug: job.slug,
        title: job.title,
        company: job.company,
        locationCity: job.locationCity,
        isRemote: job.isRemote,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        skills: job.skills,
        matchPercent: Math.round(overlap * 100),
        type: 'job' as const,
      };
    })
    .filter((j) => j.matchPercent > 0)
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, limit);
}

export async function generateRecommendations(
  prisma: PrismaClient,
  input: {
    skills: string[];
    interests: string[];
    targetRole?: string | null;
    resumeContent?: ResumeContent | null;
    education?: { college?: string | null; graduationYear?: number | null };
  }
): Promise<CareerRecommendations> {
  const resumeSkills = input.resumeContent ? extractSkillsFromResume(input.resumeContent) : [];
  const allSkills = [...new Set([...input.skills, ...resumeSkills].map(normalizeSkill))];

  const targetKey = (input.targetRole ?? input.interests[0] ?? 'software engineer').toLowerCase();
  const roleDef =
    ROLE_CAREERS[targetKey] ??
    ROLE_CAREERS['software engineer'];

  const recommendedCareers = Object.entries(ROLE_CAREERS)
    .map(([role, def]) => ({
      role,
      matchPercent: Math.round(skillOverlap(allSkills, def.skills) * 100),
      reason: `Based on your skills overlap with ${role} requirements`,
    }))
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, 5);

  const recommendedJobs = await fetchJobMatches(prisma, allSkills, 8);

  const roadmaps = await prisma.careerRoadmap.findMany({
    where: { isPublished: true },
    take: 20,
  });

  const topicHints = [...allSkills, targetKey, ...input.interests.map((i) => i.toLowerCase())];
  const recommendedRoadmaps = roadmaps
    .map((r) => {
      const topic = (r.topic ?? r.title).toLowerCase();
      const match = topicHints.some((h) => topic.includes(h) || h.includes(topic)) ? 85 : 40;
      return {
        slug: r.slug,
        title: r.title,
        topic: r.topic,
        matchPercent: match,
      };
    })
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, 5);

  const recommendedSkills = roleDef.skills
    .filter((s) => !allSkills.some((u) => u.includes(s) || s.includes(u)))
    .slice(0, 8);

  return {
    recommendedCareers,
    recommendedJobs,
    recommendedRoadmaps,
    recommendedSkills,
  };
}
