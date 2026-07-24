export type ImageCategory =
  | 'company-tech'
  | 'company-enterprise'
  | 'company-consulting'
  | 'company-fintech'
  | 'job-career'
  | 'job-remote'
  | 'job-fresher'
  | 'internship-students'
  | 'internship-learning'
  | 'roadmap-dsa'
  | 'roadmap-web'
  | 'roadmap-data'
  | 'roadmap-ai'
  | 'roadmap-devops'
  | 'roadmap-mobile'
  | 'blog-placement'
  | 'blog-interview'
  | 'blog-resume'
  | 'blog-general';

export interface StockImageMeta {
  /** Full CDN URL (Unsplash / Pexels — royalty-free) */
  src: string;
  alt: string;
  title: string;
  width: number;
  height: number;
  category: ImageCategory;
  credit?: string;
}

export interface ContentImageProps {
  src?: string | null;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  aspectRatio?: '16/9' | '4/3' | '1/1' | '21/9';
  caption?: string;
  fallbackCategory?: ImageCategory;
}
