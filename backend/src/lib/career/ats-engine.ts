import type { ResumeContent } from './resume-types';
import { resumeContentToText, extractSkillsFromResume } from './resume-types';

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'for', 'to', 'in', 'on', 'at', 'with', 'of', 'is', 'are',
  'will', 'be', 'as', 'by', 'from', 'that', 'this', 'we', 'you', 'your', 'our', 'have', 'has',
]);

export interface AtsScanResult {
  overallScore: number;
  keywordScore: number;
  formattingScore: number;
  matchDetails: {
    matchedKeywords: string[];
    missingKeywords: string[];
    sectionAnalysis: Record<string, { present: boolean; score: number; note: string }>;
    wordCount: number;
    hasContactInfo: boolean;
    hasExperience: boolean;
    hasEducation: boolean;
  };
  suggestions: string[];
  improvementPlan: string[];
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

function extractJdKeywords(jobDescription: string): string[] {
  const tokens = tokenize(jobDescription);
  const freq = new Map<string, number>();
  for (const t of tokens) freq.set(t, (freq.get(t) ?? 0) + 1);
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40)
    .map(([word]) => word);
}

export function runAtsScan(content: ResumeContent, jobDescription?: string): AtsScanResult {
  const resumeText = resumeContentToText(content);
  const resumeTokens = new Set(tokenize(resumeText));
  const resumeSkills = new Set(extractSkillsFromResume(content));

  const sections: AtsScanResult['matchDetails']['sectionAnalysis'] = {
    personalInfo: {
      present: Boolean(content.personalInfo.fullName && content.personalInfo.email),
      score: content.personalInfo.fullName && content.personalInfo.email ? 100 : 30,
      note: content.personalInfo.fullName ? 'Contact block present' : 'Add full name and email',
    },
    summary: {
      present: content.summary.length >= 50,
      score: content.summary.length >= 100 ? 100 : content.summary.length >= 50 ? 70 : 20,
      note: content.summary.length >= 50 ? 'Summary length is adequate' : 'Add a 2-3 line professional summary',
    },
    education: {
      present: content.education.length > 0,
      score: content.education.length > 0 ? 100 : 0,
      note: content.education.length > 0 ? `${content.education.length} education entries` : 'Add education details',
    },
    experience: {
      present: content.experience.length > 0 || content.projects.length > 0,
      score: content.experience.length > 0 ? 100 : content.projects.length > 0 ? 60 : 10,
      note:
        content.experience.length > 0
          ? `${content.experience.length} experience entries`
          : 'Add internships, projects, or work experience',
    },
    skills: {
      present: content.skills.length >= 5,
      score: content.skills.length >= 8 ? 100 : content.skills.length >= 5 ? 75 : 30,
      note: `${content.skills.length} skills listed — aim for 8+ relevant skills`,
    },
    projects: {
      present: content.projects.length > 0,
      score: content.projects.length >= 2 ? 100 : content.projects.length === 1 ? 70 : 20,
      note: content.projects.length > 0 ? `${content.projects.length} projects` : 'Add 1-2 technical projects',
    },
  };

  const formattingChecks = Object.values(sections);
  const formattingScore = Math.round(
    formattingChecks.reduce((sum, s) => sum + s.score, 0) / formattingChecks.length
  );

  let matchedKeywords: string[] = [];
  let missingKeywords: string[] = [];
  let keywordScore = 75;

  if (jobDescription?.trim()) {
    const jdKeywords = extractJdKeywords(jobDescription);
    matchedKeywords = jdKeywords.filter(
      (kw) => resumeTokens.has(kw) || [...resumeSkills].some((s) => s.includes(kw) || kw.includes(s))
    );
    missingKeywords = jdKeywords.filter((kw) => !matchedKeywords.includes(kw)).slice(0, 15);
    keywordScore = jdKeywords.length
      ? Math.round((matchedKeywords.length / jdKeywords.length) * 100)
      : 75;
  } else {
    const defaultSkills = ['java', 'python', 'javascript', 'sql', 'react', 'communication', 'teamwork', 'problem'];
    matchedKeywords = defaultSkills.filter(
      (kw) => resumeTokens.has(kw) || [...resumeSkills].some((s) => s.includes(kw))
    );
    missingKeywords = defaultSkills.filter((kw) => !matchedKeywords.includes(kw));
    keywordScore = Math.round((matchedKeywords.length / defaultSkills.length) * 100);
  }

  const overallScore = Math.round(keywordScore * 0.55 + formattingScore * 0.45);

  const suggestions: string[] = [];
  const improvementPlan: string[] = [];

  if (!sections.personalInfo.present) suggestions.push('Add complete contact information at the top of your resume.');
  if (!sections.summary.present) suggestions.push('Write a professional summary highlighting your degree and top skills.');
  if (!sections.experience.present) suggestions.push('Include internships, freelance work, or academic projects as experience.');
  if (content.skills.length < 8) suggestions.push('Expand your skills section with tools mentioned in target job descriptions.');
  if (missingKeywords.length > 0) {
    suggestions.push(`Add missing keywords where truthful: ${missingKeywords.slice(0, 5).join(', ')}.`);
  }
  if (content.experience.some((e) => e.bullets.length === 0)) {
    suggestions.push('Use bullet points with action verbs and measurable outcomes in experience entries.');
  }

  improvementPlan.push('Week 1: Fix formatting and contact section for ATS parsing.');
  improvementPlan.push('Week 2: Tailor skills and summary to match your target role keywords.');
  improvementPlan.push('Week 3: Add quantified bullet points to experience and projects.');
  if (missingKeywords.length > 3) {
    improvementPlan.push(`Week 4: Study and honestly add gaps: ${missingKeywords.slice(0, 3).join(', ')}.`);
  }

  return {
    overallScore,
    keywordScore,
    formattingScore,
    matchDetails: {
      matchedKeywords,
      missingKeywords,
      sectionAnalysis: sections,
      wordCount: resumeText.split(/\s+/).filter(Boolean).length,
      hasContactInfo: sections.personalInfo.present,
      hasExperience: sections.experience.present,
      hasEducation: sections.education.present,
    },
    suggestions,
    improvementPlan,
  };
}
