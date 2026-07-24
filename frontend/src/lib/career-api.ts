import { api } from './api';
import type {
  Application,
  AtsScanResult,
  CareerOverview,
  CareerRecommendations,
  CoverLetter,
  CoverLetterStyle,
  Resume,
  ResumeContent,
  SavedCompany,
  SavedJob,
  SkillGapResult,
} from '@/types/career';

export const careerApi = {
  // Dashboard
  getOverview: () => api.get<CareerOverview>('/career/overview'),
  updateProfile: (data: Record<string, unknown>) => api.patch('/career/profile', data),
  getRecommendations: () => api.get<CareerRecommendations>('/career/recommendations'),
  getSkillGapRoles: () => api.get<string[]>('/career/skill-gap/roles'),
  analyzeSkillGap: (targetRole: string, currentSkills?: string[]) =>
    api.post<SkillGapResult>('/career/skill-gap', { targetRole, currentSkills }),
  getSkillGapHistory: () => api.get<SkillGapResult[]>('/career/skill-gap/history'),
  updateRoadmapProgress: (roadmapId: string, completedSteps: string[]) =>
    api.post('/career/roadmap-progress', { roadmapId, completedSteps }),

  // Resumes
  getResumeTemplates: () => api.get('/resumes/templates'),
  listResumes: () => api.get<Resume[]>('/resumes'),
  getResume: (id: string) => api.get<Resume>(`/resumes/${id}`),
  createResume: (data: { title: string; templateId?: string; content?: ResumeContent; status?: string }) =>
    api.post<Resume>('/resumes', data),
  updateResume: (id: string, data: Partial<Resume>) => api.patch<Resume>(`/resumes/${id}`, data),
  duplicateResume: (id: string) => api.post<Resume>(`/resumes/${id}/duplicate`),
  deleteResume: (id: string) => api.delete(`/resumes/${id}`),

  // ATS
  scanAts: (data: { resumeId?: string; content?: ResumeContent; jobDescription?: string; jobId?: string }) =>
    api.post<AtsScanResult>('/ats/scan', data),
  getAtsHistory: () => api.get('/ats/history'),

  // Applications
  listApplications: (status?: string) =>
    api.get<Application[]>('/applications', status ? { status } : undefined),
  getApplicationAnalytics: () => api.get('/applications/analytics'),
  createApplication: (data: {
    jobId?: string;
    internshipId?: string;
    resumeId: string;
    coverLetter?: string;
    notes?: string;
  }) => api.post<Application>('/applications', data),
  updateApplication: (id: string, data: Record<string, unknown>) =>
    api.patch<Application>(`/applications/${id}`, data),

  // Saved jobs
  listSavedJobs: (folder?: string) =>
    api.get<SavedJob[]>('/saved-jobs', folder ? { folder } : undefined),
  checkSavedJob: (params: { jobId?: string; internshipId?: string }) =>
    api.get<{ saved: boolean; savedJobId: string | null }>('/saved-jobs/check', params),
  saveJob: (data: { jobId?: string; internshipId?: string; notes?: string; folder?: string }) =>
    api.post<SavedJob>('/saved-jobs', data),
  updateSavedJob: (id: string, data: Record<string, unknown>) =>
    api.patch<SavedJob>(`/saved-jobs/${id}`, data),
  unsaveJob: (id: string) => api.delete(`/saved-jobs/${id}`),

  // Saved companies
  listSavedCompanies: () => api.get<SavedCompany[]>('/saved-companies'),
  checkSavedCompany: (companyId: string) =>
    api.get<{ saved: boolean; savedCompanyId: string | null }>('/saved-companies/check', { companyId }),
  saveCompany: (data: { companyId: string; notes?: string; alertEnabled?: boolean }) =>
    api.post<SavedCompany>('/saved-companies', data),
  updateSavedCompany: (id: string, data: Record<string, unknown>) =>
    api.patch<SavedCompany>(`/saved-companies/${id}`, data),
  unsaveCompany: (id: string) => api.delete(`/saved-companies/${id}`),

  // Cover letters
  listCoverLetters: () => api.get<CoverLetter[]>('/cover-letters'),
  generateCoverLetter: (data: {
    resumeId?: string;
    jobTitle: string;
    companyName: string;
    jobDescription?: string;
    style?: CoverLetterStyle;
  }) => api.post<{ content: string; id: string }>('/cover-letters/generate', data),
  deleteCoverLetter: (id: string) => api.delete(`/cover-letters/${id}`),

  // Employer
  getEmployerOverview: () => api.get('/employer/overview'),
  getEmployerJobs: () => api.get('/employer/jobs'),
  getEmployerApplications: (params?: { status?: string; jobId?: string }) =>
    api.get('/employer/applications', params),
  updateEmployerApplication: (id: string, data: Record<string, unknown>) =>
    api.patch(`/employer/applications/${id}`, data),
  getEmployerCompanies: () => api.get('/employer/companies'),
};
