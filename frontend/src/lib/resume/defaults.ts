import type { ResumeContent, ResumeSectionId } from '@/types/career';

export const DEFAULT_SECTION_ORDER: ResumeSectionId[] = [
  'personalInfo',
  'summary',
  'education',
  'experience',
  'skills',
  'projects',
  'certifications',
  'achievements',
  'languages',
];

export const EMPTY_RESUME: ResumeContent = {
  personalInfo: { fullName: '', email: '', phone: '', location: '' },
  summary: '',
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  achievements: [],
  languages: [],
  sectionOrder: [...DEFAULT_SECTION_ORDER],
};

export function newId(): string {
  return crypto.randomUUID();
}
