import { apiFetch, type ApiResponse } from './api';
import type {
  BlogPost,
  CareerRoadmap,
  Category,
  Company,
  ContentStatus,
  DifficultyLevel,
  EmploymentType,
  Internship,
  InterviewQuestion,
  Job,
  ListingStatus,
  PaginationMeta,
  RoadmapStep,
  Tag,
} from '@/types/api';
import type { UserRole } from '@/config/roles';

type Params = Record<string, string | number | boolean | undefined>;

async function adminFetch<T>(
  path: string,
  options: RequestInit & { params?: Params } = {}
): Promise<ApiResponse<T>> {
  const { params, ...init } = options;
  return apiFetch<T>(`/api/v1/admin${path}`, { ...init, params });
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string | null;
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: unknown;
  createdAt: string;
  actor?: { id: string; name: string; email: string } | null;
}

export interface DashboardStats {
  users: number;
  jobs: { active: number; draft: number };
  internships: number;
  blogPosts: number;
  companies: number;
  newsletterSubscribers: number;
  applications: number;
  recentAuditLogs: AuditLogEntry[];
}

export interface AnalyticsData {
  topJobs: { id: string; slug: string; title: string; viewCount: number; company: { name: string } }[];
  topCompanies: {
    id: string;
    slug: string;
    name: string;
    jobCount: number;
    internshipCount: number;
    logoUrl?: string | null;
  }[];
  userGrowth: { date: string; count: number }[];
  searchPlaceholders: { term: string; viewCount: number }[];
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: 'pending' | 'active' | 'unsubscribed' | 'bounced';
  preferences: Record<string, boolean>;
  confirmedAt?: string | null;
  source?: string | null;
  createdAt: string;
}

export interface SeoPage {
  id: string;
  path: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  canonicalUrl?: string | null;
  robotsIndex: boolean;
  schemaMarkup?: unknown;
  seoScore: number;
  updatedAt: string;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  publicId: string;
  url: string;
  secureUrl: string;
  format?: string | null;
  width?: number | null;
  height?: number | null;
  bytes?: number | null;
  altText?: string | null;
  category?: string | null;
  uploadedById: string;
  createdAt: string;
}

export interface UploadSignature {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
}

export interface SiteSettings {
  logo?: string;
  favicon?: string;
  siteName?: string;
  tagline?: string;
  social?: { twitter?: string; linkedin?: string; instagram?: string; youtube?: string };
  contact?: { email?: string; phone?: string; address?: string };
  footer?: { copyright?: string; links?: { label: string; href: string }[] };
  adsense?: AdSenseConfig;
}

export interface AdSenseConfig {
  publisherId?: string;
  enabled?: boolean;
  slots?: Record<string, { enabled: boolean; slotId?: string }>;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const adminApi = {
  dashboard: {
    get: () => adminFetch<DashboardStats>('/dashboard'),
    analytics: () => adminFetch<AnalyticsData>('/dashboard/analytics'),
  },

  jobs: {
    list: (params?: Params) => adminFetch<Job[]>('/jobs', { params }),
    get: (id: string) => adminFetch<Job>(`/jobs/${id}`),
    create: (body: Partial<Job> & { title: string; description: string; companyId: string }) =>
      adminFetch<Job>('/jobs', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<Job>) =>
      adminFetch<Job>(`/jobs/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) => adminFetch<void>(`/jobs/${id}`, { method: 'DELETE' }),
    bulk: (action: 'publish' | 'delete' | 'feature', ids: string[]) =>
      adminFetch<{ affected: number }>('/jobs/bulk', {
        method: 'POST',
        body: JSON.stringify({ action, ids }),
      }),
    publish: (id: string) =>
      adminFetch<Job>(`/jobs/${id}/publish`, { method: 'POST' }),
  },

  internships: {
    list: (params?: Params) => adminFetch<Internship[]>('/internships', { params }),
    get: (id: string) => adminFetch<Internship>(`/internships/${id}`),
    create: (body: Partial<Internship> & { title: string; description: string; companyId: string }) =>
      adminFetch<Internship>('/internships', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<Internship>) =>
      adminFetch<Internship>(`/internships/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) => adminFetch<void>(`/internships/${id}`, { method: 'DELETE' }),
    bulk: (action: 'publish' | 'delete' | 'feature', ids: string[]) =>
      adminFetch<{ affected: number }>('/internships/bulk', {
        method: 'POST',
        body: JSON.stringify({ action, ids }),
      }),
    publish: (id: string) =>
      adminFetch<Internship>(`/internships/${id}/publish`, { method: 'POST' }),
  },

  companies: {
    list: (params?: Params) => adminFetch<Company[]>('/companies', { params }),
    get: (id: string) => adminFetch<Company>(`/companies/${id}`),
    create: (body: Partial<Company> & { name: string }) =>
      adminFetch<Company>('/companies', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<Company>) =>
      adminFetch<Company>(`/companies/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) => adminFetch<void>(`/companies/${id}`, { method: 'DELETE' }),
    verify: (id: string) =>
      adminFetch<Company>(`/companies/${id}/verify`, { method: 'POST' }),
  },

  blog: {
    list: (params?: Params) => adminFetch<BlogPost[]>('/blog', { params }),
    get: (id: string) => adminFetch<BlogPost & { faq?: FaqItem[] }>(`/blog/${id}`),
    create: (body: Record<string, unknown>) =>
      adminFetch<BlogPost>('/blog', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Record<string, unknown>) =>
      adminFetch<BlogPost>(`/blog/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) => adminFetch<void>(`/blog/${id}`, { method: 'DELETE' }),
    publish: (id: string) =>
      adminFetch<BlogPost>(`/blog/${id}/publish`, { method: 'POST' }),
  },

  roadmaps: {
    list: (params?: Params) => adminFetch<CareerRoadmap[]>('/roadmaps', { params }),
    get: (id: string) => adminFetch<CareerRoadmap>(`/roadmaps/${id}`),
    create: (body: Partial<CareerRoadmap> & { title: string; steps?: Partial<RoadmapStep>[] }) =>
      adminFetch<CareerRoadmap>('/roadmaps', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<CareerRoadmap>) =>
      adminFetch<CareerRoadmap>(`/roadmaps/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) => adminFetch<void>(`/roadmaps/${id}`, { method: 'DELETE' }),
    updateSteps: (id: string, steps: Partial<RoadmapStep>[]) =>
      adminFetch<CareerRoadmap>(`/roadmaps/${id}/steps`, {
        method: 'PUT',
        body: JSON.stringify({ steps }),
      }),
  },

  interviewQuestions: {
    list: (params?: Params) => adminFetch<InterviewQuestion[]>('/interview-questions', { params }),
    get: (id: string) => adminFetch<InterviewQuestion>(`/interview-questions/${id}`),
    create: (body: Partial<InterviewQuestion> & { question: string; answer: string }) =>
      adminFetch<InterviewQuestion>('/interview-questions', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    update: (id: string, body: Partial<InterviewQuestion>) =>
      adminFetch<InterviewQuestion>(`/interview-questions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),
    delete: (id: string) => adminFetch<void>(`/interview-questions/${id}`, { method: 'DELETE' }),
  },

  users: {
    list: (params?: Params) => adminFetch<AdminUser[]>('/users', { params }),
    get: (id: string) => adminFetch<AdminUser>(`/users/${id}`),
    update: (id: string, body: { role?: UserRole; isActive?: boolean }) =>
      adminFetch<AdminUser>(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) => adminFetch<void>(`/users/${id}`, { method: 'DELETE' }),
  },

  newsletter: {
    list: (params?: Params) => adminFetch<NewsletterSubscriber[]>('/newsletter', { params }),
    update: (id: string, body: { status: NewsletterSubscriber['status'] }) =>
      adminFetch<NewsletterSubscriber>(`/newsletter/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),
    delete: (id: string) => adminFetch<void>(`/newsletter/${id}`, { method: 'DELETE' }),
    export: () => adminFetch<NewsletterSubscriber[]>('/newsletter/export'),
    sendTest: (email: string) =>
      adminFetch<{ sent: boolean }>('/newsletter/send-test', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
  },

  seo: {
    list: (params?: Params) => adminFetch<SeoPage[]>('/seo', { params }),
    get: (id: string) => adminFetch<SeoPage>(`/seo/${id}`),
    create: (body: Partial<SeoPage> & { path: string }) =>
      adminFetch<SeoPage>('/seo', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<SeoPage>) =>
      adminFetch<SeoPage>(`/seo/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) => adminFetch<void>(`/seo/${id}`, { method: 'DELETE' }),
    scan: () => adminFetch<{ scanned: number; pages: SeoPage[] }>('/seo/scan', { method: 'POST' }),
    bulkUpdate: (pages: Partial<SeoPage>[]) =>
      adminFetch<SeoPage[]>('/seo/bulk', { method: 'PATCH', body: JSON.stringify({ pages }) }),
  },

  media: {
    list: (params?: Params) => adminFetch<MediaAsset[]>('/media', { params }),
    uploadSignature: () =>
      adminFetch<UploadSignature>('/media/upload-signature', { method: 'POST' }),
    create: (body: {
      publicId: string;
      url: string;
      secureUrl: string;
      format?: string;
      width?: number;
      height?: number;
      bytes?: number;
      altText?: string;
      category?: string;
    }) => adminFetch<MediaAsset>('/media', { method: 'POST', body: JSON.stringify(body) }),
    delete: (id: string) => adminFetch<void>(`/media/${id}`, { method: 'DELETE' }),
  },

  settings: {
    get: () => adminFetch<SiteSettings>('/settings'),
    update: (body: Partial<SiteSettings>) =>
      adminFetch<SiteSettings>('/settings', { method: 'PATCH', body: JSON.stringify(body) }),
  },

  categories: {
    list: (params?: Params) => adminFetch<Category[]>('/categories', { params }),
    create: (body: Partial<Category> & { name: string }) =>
      adminFetch<Category>('/categories', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<Category>) =>
      adminFetch<Category>(`/categories/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) => adminFetch<void>(`/categories/${id}`, { method: 'DELETE' }),
  },

  tags: {
    list: (params?: Params) => adminFetch<Tag[]>('/tags', { params }),
    create: (body: { name: string }) =>
      adminFetch<Tag>('/tags', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: { name: string }) =>
      adminFetch<Tag>(`/tags/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) => adminFetch<void>(`/tags/${id}`, { method: 'DELETE' }),
  },
};

export type {
  ListingStatus,
  ContentStatus,
  EmploymentType,
  DifficultyLevel,
  PaginationMeta,
};
