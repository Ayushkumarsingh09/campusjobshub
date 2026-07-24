import { z } from 'zod';

const resumeContentSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().default(''),
    email: z.string().default(''),
    phone: z.string().default(''),
    location: z.string().default(''),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    portfolio: z.string().optional(),
  }),
  summary: z.string().default(''),
  education: z.array(z.any()).default([]),
  experience: z.array(z.any()).default([]),
  skills: z.array(z.string()).default([]),
  projects: z.array(z.any()).default([]),
  certifications: z.array(z.any()).default([]),
  achievements: z.array(z.any()).default([]),
  languages: z.array(z.any()).default([]),
  sectionOrder: z.array(z.string()).optional(),
});

export const createResumeSchema = z.object({
  title: z.string().min(1).max(150),
  templateId: z.string().max(50).default('modern'),
  content: resumeContentSchema.optional(),
  status: z.enum(['draft', 'published']).optional(),
});

export const updateResumeSchema = createResumeSchema.partial().extend({
  isPrimary: z.boolean().optional(),
});

export const atsScanSchema = z.object({
  resumeId: z.string().uuid().optional(),
  content: resumeContentSchema.optional(),
  jobDescription: z.string().optional(),
  jobId: z.string().uuid().optional(),
});

export const createApplicationSchema = z.object({
  jobId: z.string().uuid().optional(),
  internshipId: z.string().uuid().optional(),
  resumeId: z.string().uuid(),
  coverLetter: z.string().optional(),
  notes: z.string().optional(),
}).refine((d) => d.jobId || d.internshipId, { message: 'jobId or internshipId required' });

export const updateApplicationSchema = z.object({
  status: z.enum([
    'submitted', 'under_review', 'interview_scheduled', 'assessment',
    'shortlisted', 'offer_received', 'rejected', 'hired', 'withdrawn', 'archived',
  ]).optional(),
  notes: z.string().optional(),
  interviewAt: z.string().datetime().optional().nullable(),
  reminderAt: z.string().datetime().optional().nullable(),
  employerNotes: z.string().optional(),
});

export const saveJobSchema = z.object({
  jobId: z.string().uuid().optional(),
  internshipId: z.string().uuid().optional(),
  notes: z.string().optional(),
  folder: z.string().max(50).optional(),
  reminderAt: z.string().datetime().optional().nullable(),
}).refine((d) => d.jobId || d.internshipId, { message: 'jobId or internshipId required' });

export const updateSavedJobSchema = z.object({
  notes: z.string().optional(),
  folder: z.string().max(50).optional(),
  reminderAt: z.string().datetime().optional().nullable(),
});

export const saveCompanySchema = z.object({
  companyId: z.string().uuid(),
  notes: z.string().optional(),
  alertEnabled: z.boolean().optional(),
});

export const coverLetterGenerateSchema = z.object({
  resumeId: z.string().uuid().optional(),
  jobTitle: z.string().min(1).max(200),
  companyName: z.string().min(1).max(200),
  jobDescription: z.string().optional(),
  style: z.enum(['professional', 'enthusiastic', 'concise', 'storytelling']).default('professional'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(150).optional(),
  college: z.string().max(200).optional().nullable(),
  graduationYear: z.number().int().min(2020).max(2035).optional().nullable(),
  bio: z.string().max(1000).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  targetRole: z.string().max(150).optional().nullable(),
});

export const skillGapSchema = z.object({
  targetRole: z.string().min(1).max(150),
  currentSkills: z.array(z.string()).optional(),
});

export const roadmapProgressSchema = z.object({
  roadmapId: z.string().uuid(),
  completedSteps: z.array(z.string()),
});
