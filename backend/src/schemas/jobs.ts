import { z } from 'zod';
import { paginationSchema } from './common';

export const jobListSchema = paginationSchema.extend({
  city: z.string().optional(),
  state: z.string().optional(),
  category: z.string().optional(),
  remote: z.coerce.boolean().optional(),
  experienceMin: z.coerce.number().optional(),
  experienceMax: z.coerce.number().optional(),
  search: z.string().optional(),
  status: z.enum(['active', 'closed', 'expired']).default('active'),
});

export const jobCreateSchema = z.object({
  title: z.string().min(5).max(300),
  description: z.string().min(200),
  companyId: z.string().uuid(),
  categoryId: z.string().uuid().optional(),
  locationCity: z.string().optional(),
  locationState: z.string().optional(),
  isRemote: z.boolean().default(false),
  experienceMin: z.number().min(0).default(0),
  experienceMax: z.number().optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  skills: z.array(z.string()).default([]),
  applicationMethod: z.enum(['internal', 'external']).default('internal'),
  externalApplyUrl: z.string().url().optional(),
  expiresAt: z.string().datetime(),
});

export type JobListInput = z.infer<typeof jobListSchema>;
