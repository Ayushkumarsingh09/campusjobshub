export interface FaqItem {
  question: string;
  answer: string;
}

export interface InternalLink {
  title: string;
  href: string;
  anchor?: string;
}

export interface ContentAuthor {
  name: string;
  id?: string;
  avatarUrl?: string | null;
  role?: string;
}

export type RelatedContentType =
  | 'blog'
  | 'job'
  | 'internship'
  | 'company'
  | 'roadmap'
  | 'interview';

export interface RelatedContentItem {
  type: RelatedContentType;
  title: string;
  href: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  meta?: string | null;
  score: number;
}

export interface ContentQualityResult {
  seoScore: number;
  contentScore: number;
  overallScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  issues: string[];
  passesAdSense: boolean;
}
