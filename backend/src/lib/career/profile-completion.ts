import type { ResumeContent } from './resume-types';

export function calculateProfileCompletion(input: {
  name: string;
  college?: string | null;
  graduationYear?: number | null;
  bio?: string | null;
  phone?: string | null;
  skills: string[];
  targetRole?: string | null;
  resumeCount: number;
  applicationCount: number;
}): number {
  let score = 0;
  if (input.name) score += 10;
  if (input.college) score += 10;
  if (input.graduationYear) score += 10;
  if (input.phone) score += 5;
  if (input.bio && input.bio.length >= 20) score += 10;
  if (input.skills.length >= 3) score += 15;
  if (input.targetRole) score += 10;
  if (input.resumeCount > 0) score += 20;
  if (input.applicationCount > 0) score += 10;
  return Math.min(100, score);
}

export function resumeCompletionScore(content: ResumeContent): number {
  let score = 0;
  if (content.personalInfo.fullName && content.personalInfo.email) score += 15;
  if (content.summary.length >= 50) score += 15;
  if (content.education.length > 0) score += 15;
  if (content.experience.length > 0 || content.projects.length > 0) score += 20;
  if (content.skills.length >= 5) score += 15;
  if (content.projects.length > 0) score += 10;
  if (content.certifications.length > 0 || content.achievements.length > 0) score += 10;
  return Math.min(100, score);
}
