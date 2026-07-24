// Enum unions matching backend Prisma schema values

export type CompanySize =
  | 'SIZE_1_10'
  | 'SIZE_11_50'
  | 'SIZE_51_200'
  | 'SIZE_201_500'
  | 'SIZE_501_1000'
  | 'SIZE_1001_5000'
  | 'SIZE_5000_PLUS';

export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'freelance' | 'temporary';

export type ApplicationMethod = 'internal' | 'external';

export type ListingStatus = 'draft' | 'pending_review' | 'active' | 'closed' | 'expired';

export type ContentStatus = 'draft' | 'published' | 'archived';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Tag {
  id: string;
  slug: string;
  name: string;
  usageCount: number;
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
}

export interface Company {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  website?: string | null;
  industry?: string | null;
  companySize?: CompanySize | null;
  headquartersCity?: string | null;
  headquartersState?: string | null;
  isVerified: boolean;
  verifiedAt?: string | null;
  ownerUserId: string;
  jobCount: number;
  internshipCount: number;
  careersPageUrl?: string | null;
  ogImageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface Job {
  id: string;
  slug: string;
  title: string;
  description: string;
  companyId: string;
  categoryId?: string | null;
  postedByUserId: string;
  locationCity?: string | null;
  locationState?: string | null;
  isRemote: boolean;
  experienceMin: number;
  experienceMax?: number | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryDisclosed: boolean;
  employmentType: EmploymentType;
  skills: string[];
  applicationMethod: ApplicationMethod;
  externalApplyUrl?: string | null;
  status: ListingStatus;
  viewCount: number;
  applicationCount: number;
  expiresAt: string;
  applicationDeadline?: string | null;
  publishedAt?: string | null;
  isFeatured?: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImageUrl?: string | null;
  canonicalUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  company?: Pick<Company, 'id' | 'name' | 'slug' | 'logoUrl' | 'isVerified' | 'website' | 'careersPageUrl'>;
  category?: Category | null;
  tags?: { tag: Tag }[];
}

export interface Internship {
  id: string;
  slug: string;
  title: string;
  description: string;
  companyId: string;
  categoryId?: string | null;
  postedByUserId: string;
  locationCity?: string | null;
  locationState?: string | null;
  isRemote: boolean;
  durationMonths?: number | null;
  stipendMin?: number | null;
  stipendMax?: number | null;
  isPaid: boolean;
  ppoAvailable: boolean;
  startDate?: string | null;
  skills: string[];
  applicationMethod: ApplicationMethod;
  externalApplyUrl?: string | null;
  status: ListingStatus;
  viewCount: number;
  applicationCount: number;
  expiresAt: string;
  applicationDeadline?: string | null;
  publishedAt?: string | null;
  isFeatured?: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImageUrl?: string | null;
  canonicalUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  company?: Pick<Company, 'id' | 'name' | 'slug' | 'logoUrl' | 'isVerified' | 'website' | 'careersPageUrl'>;
  category?: Category | null;
  tags?: { tag: Tag }[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface InternalLink {
  title: string;
  href: string;
  anchor?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  featuredImageUrl?: string | null;
  authorId: string;
  categoryId?: string | null;
  status: ContentStatus;
  readingTimeMinutes?: number | null;
  viewCount: number;
  publishedAt?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  faq?: FaqItem[] | null;
  internalLinks?: InternalLink[] | null;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  author?: { id: string; name: string; avatarUrl?: string | null; bio?: string | null };
  category?: Category | null;
  tags?: { tag: Tag }[];
}

export interface InterviewQuestion {
  id: string;
  slug: string;
  question: string;
  answer: string;
  companyId?: string | null;
  role?: string | null;
  difficulty: DifficultyLevel;
  topic?: string | null;
  viewCount: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  company?: Pick<Company, 'id' | 'name' | 'slug' | 'logoUrl'> | null;
  tags?: { tag: Tag }[];
}

export interface RoadmapStep {
  id: string;
  roadmapId: string;
  slug: string;
  title: string;
  description?: string | null;
  stepOrder: number;
  resourceUrl?: string | null;
  resourceType?: string | null;
  estimatedHours?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CareerRoadmap {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  difficulty: DifficultyLevel;
  estimatedHours?: number | null;
  thumbnailUrl?: string | null;
  topic?: string | null;
  isPublished: boolean;
  viewCount: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
  createdAt: string;
  updatedAt: string;
  steps?: RoadmapStep[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}
