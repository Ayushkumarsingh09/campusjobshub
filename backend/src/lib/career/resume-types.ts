export const RESUME_SECTIONS = [
  'personalInfo',
  'summary',
  'education',
  'experience',
  'skills',
  'projects',
  'certifications',
  'achievements',
  'languages',
] as const;

export type ResumeSectionId = (typeof RESUME_SECTIONS)[number];

export interface ResumePersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface ResumeEducation {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  highlights: string[];
}

export interface ResumeExperience {
  id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface ResumeProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface ResumeCertification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface ResumeAchievement {
  id: string;
  title: string;
  description: string;
}

export interface ResumeLanguage {
  id: string;
  name: string;
  proficiency: string;
}

export interface ResumeContent {
  personalInfo: ResumePersonalInfo;
  summary: string;
  education: ResumeEducation[];
  experience: ResumeExperience[];
  skills: string[];
  projects: ResumeProject[];
  certifications: ResumeCertification[];
  achievements: ResumeAchievement[];
  languages: ResumeLanguage[];
  sectionOrder: ResumeSectionId[];
}

export const EMPTY_RESUME_CONTENT: ResumeContent = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
  },
  summary: '',
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  achievements: [],
  languages: [],
  sectionOrder: [...RESUME_SECTIONS],
};

export const RESUME_TEMPLATES = [
  { id: 'modern', name: 'Modern', description: 'Clean two-column layout with accent header', atsFriendly: true },
  { id: 'classic', name: 'Classic', description: 'Traditional single-column professional format', atsFriendly: true },
  { id: 'ats-minimal', name: 'ATS Minimal', description: 'Plain text optimized for parsing systems', atsFriendly: true },
  { id: 'tech', name: 'Tech', description: 'Skills-forward layout for engineering roles', atsFriendly: true },
  { id: 'compact', name: 'Compact', description: 'Dense one-page layout for freshers', atsFriendly: true },
  { id: 'executive', name: 'Executive', description: 'Bold headings for experienced candidates', atsFriendly: false },
] as const;

export function resumeContentToText(content: ResumeContent): string {
  const parts: string[] = [];
  const pi = content.personalInfo;
  parts.push(pi.fullName, pi.email, pi.phone, pi.location, pi.linkedin ?? '', pi.github ?? '');
  parts.push(content.summary);
  for (const edu of content.education) {
    parts.push(edu.school, edu.degree, edu.field, ...edu.highlights);
  }
  for (const exp of content.experience) {
    parts.push(exp.company, exp.title, ...exp.bullets);
  }
  parts.push(...content.skills);
  for (const p of content.projects) {
    parts.push(p.name, p.description, ...p.technologies);
  }
  for (const c of content.certifications) parts.push(c.name, c.issuer);
  for (const a of content.achievements) parts.push(a.title, a.description);
  for (const l of content.languages) parts.push(l.name, l.proficiency);
  return parts.filter(Boolean).join(' ');
}

export function extractSkillsFromResume(content: ResumeContent): string[] {
  const skills = new Set(content.skills.map((s) => s.toLowerCase().trim()));
  for (const p of content.projects) {
    for (const t of p.technologies) skills.add(t.toLowerCase().trim());
  }
  return Array.from(skills).filter(Boolean);
}
