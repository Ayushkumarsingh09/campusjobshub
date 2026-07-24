export type ApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'interview_scheduled'
  | 'assessment'
  | 'shortlisted'
  | 'offer_received'
  | 'rejected'
  | 'hired'
  | 'withdrawn'
  | 'archived';

export type ResumeStatus = 'draft' | 'published';
export type CoverLetterStyle = 'professional' | 'enthusiastic' | 'concise' | 'storytelling';

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

export type ResumeSectionId =
  | 'personalInfo'
  | 'summary'
  | 'education'
  | 'experience'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'achievements'
  | 'languages';

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

export interface Resume {
  id: string;
  userId: string;
  title: string;
  templateId: string;
  content: ResumeContent;
  pdfUrl?: string | null;
  status: ResumeStatus;
  isPrimary: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  atsFriendly: boolean;
}

export interface ApplicationEvent {
  id: string;
  applicationId: string;
  status: ApplicationStatus;
  title?: string | null;
  notes?: string | null;
  occurredAt: string;
}

export interface Application {
  id: string;
  userId: string;
  jobId?: string | null;
  internshipId?: string | null;
  resumeId: string;
  resumeSnapshot: ResumeContent;
  coverLetter?: string | null;
  status: ApplicationStatus;
  notes?: string | null;
  interviewAt?: string | null;
  reminderAt?: string | null;
  employerNotes?: string | null;
  appliedAt: string;
  statusChangedAt: string;
  job?: {
    id: string;
    title: string;
    slug: string;
    company?: { id: string; name: string; slug: string; logoUrl?: string | null };
  } | null;
  internship?: {
    id: string;
    title: string;
    slug: string;
    company?: { id: string; name: string; slug: string; logoUrl?: string | null };
  } | null;
  resume?: { id: string; title: string };
  events?: ApplicationEvent[];
}

export interface SavedJob {
  id: string;
  userId: string;
  jobId?: string | null;
  internshipId?: string | null;
  notes?: string | null;
  folder: string;
  reminderAt?: string | null;
  createdAt: string;
  job?: {
    id: string;
    title: string;
    slug: string;
    locationCity?: string | null;
    isRemote: boolean;
    company?: { id: string; name: string; slug: string; logoUrl?: string | null };
  } | null;
  internship?: {
    id: string;
    title: string;
    slug: string;
    locationCity?: string | null;
    company?: { id: string; name: string; slug: string; logoUrl?: string | null };
  } | null;
}

export interface SavedCompany {
  id: string;
  userId: string;
  companyId: string;
  notes?: string | null;
  alertEnabled: boolean;
  createdAt: string;
  company: {
    id: string;
    slug: string;
    name: string;
    logoUrl?: string | null;
    industry?: string | null;
    jobCount: number;
    internshipCount: number;
    isVerified: boolean;
  };
}

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
  reportId?: string;
  createdAt?: string;
}

export interface CoverLetter {
  id: string;
  jobTitle?: string | null;
  companyName?: string | null;
  style: CoverLetterStyle;
  content: string;
  createdAt: string;
}

export interface CareerOverview {
  stats: {
    applications: number;
    savedJobs: number;
    savedCompanies: number;
    resumes: number;
    atsScore: number | null;
    profileCompletion: number;
  };
  recentApplications: Application[];
  roadmapProgress: {
    progressPercent: number;
    roadmap: { slug: string; title: string; topic?: string | null };
  }[];
  recommendations: {
    jobs: { id: string; slug: string; title: string; matchPercent: number; company?: { name: string; slug: string } }[];
    roadmaps: { slug: string; title: string; matchPercent: number }[];
    skills: string[];
  };
  skillGap: { matchPercent: number; missingSkills: string[] } | null;
}

export interface SkillGapResult {
  targetRole: string;
  currentSkills: string[];
  targetSkills: string[];
  missingSkills: string[];
  matchPercent: number;
  learningPlan: { week: number; focus: string; resources: string[] }[];
  roadmapSlugs: string[];
  reportId?: string;
}

export interface CareerRecommendations {
  recommendedCareers: { role: string; matchPercent: number; reason: string }[];
  recommendedJobs: {
    id: string;
    slug: string;
    title: string;
    matchPercent: number;
    type: 'job';
    company?: { name: string; slug: string; logoUrl?: string | null };
    locationCity?: string | null;
    isRemote?: boolean;
  }[];
  recommendedRoadmaps: { slug: string; title: string; topic?: string | null; matchPercent: number }[];
  recommendedSkills: string[];
}

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  submitted: 'Applied',
  under_review: 'Under Review',
  interview_scheduled: 'Interview Scheduled',
  assessment: 'Assessment',
  shortlisted: 'Shortlisted',
  offer_received: 'Offer Received',
  rejected: 'Rejected',
  hired: 'Hired',
  withdrawn: 'Withdrawn',
  archived: 'Archived',
};

export const KANBAN_COLUMNS: ApplicationStatus[] = [
  'submitted',
  'interview_scheduled',
  'assessment',
  'offer_received',
  'rejected',
  'archived',
];
