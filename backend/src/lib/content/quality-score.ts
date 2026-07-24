/**
 * Content Quality Scoring — AdSense & SEO readiness
 */

export interface QualityInput {
  title: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  content: string;
  faqCount?: number;
  internalLinkCount?: number;
  hasFeaturedImage?: boolean;
  hasAuthor?: boolean;
  wordCountMin?: number;
}

export interface QualityResult {
  seoScore: number;
  contentScore: number;
  overallScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  issues: string[];
  passesAdSense: boolean;
}

export function scoreContentQuality(input: QualityInput): QualityResult {
  const issues: string[] = [];
  let seoScore = 0;
  let contentScore = 0;

  const title = input.metaTitle || input.title;
  const description = input.metaDescription || '';
  const wordCount = input.content.split(/\s+/).filter(Boolean).length;
  const minWords = input.wordCountMin ?? 300;

  // SEO scoring (50 pts)
  if (title.length >= 30 && title.length <= 60) seoScore += 12;
  else if (title.length > 0) { seoScore += 6; issues.push('Meta title should be 30–60 characters'); }

  if (description.length >= 120 && description.length <= 160) seoScore += 12;
  else if (description.length >= 80) seoScore += 7;
  else { issues.push('Meta description should be 120–160 characters'); }

  if (input.hasFeaturedImage) seoScore += 8;
  else issues.push('Add a featured image for better engagement');

  if ((input.faqCount ?? 0) >= 3) seoScore += 10;
  else issues.push('Add at least 3 FAQ items for rich results');

  if ((input.internalLinkCount ?? 0) >= 3) seoScore += 8;
  else issues.push('Add at least 3 internal links');

  // Content scoring (50 pts)
  if (wordCount >= 800) contentScore += 20;
  else if (wordCount >= minWords) contentScore += 12;
  else issues.push(`Content needs at least ${minWords} words (currently ${wordCount})`);

  if (input.hasAuthor) contentScore += 10;
  else issues.push('Author attribution required');

  const headings = (input.content.match(/^##\s/gm) || []).length;
  if (headings >= 3) contentScore += 10;
  else issues.push('Use at least 3 section headings (H2)');

  if (wordCount >= 300 && !input.content.toLowerCase().includes('lorem ipsum')) contentScore += 10;
  else issues.push('Avoid placeholder or thin content');

  const overallScore = Math.min(100, seoScore + contentScore);
  const grade = overallScore >= 85 ? 'A' : overallScore >= 70 ? 'B' : overallScore >= 55 ? 'C' : overallScore >= 40 ? 'D' : 'F';
  const passesAdSense =
    wordCount >= 300 &&
    issues.filter((i) => i.includes('words')).length === 0 &&
    Boolean(input.hasAuthor);

  return { seoScore, contentScore, overallScore, grade, issues, passesAdSense };
}

export const ADSENSE_MIN_WORDS = 300;
export const BLOG_MIN_WORDS = 800;
export const GUIDE_MIN_WORDS = 600;
