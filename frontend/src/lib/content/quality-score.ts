import type { ContentQualityResult } from './types';

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

export function scoreContentQuality(input: QualityInput): ContentQualityResult {
  const issues: string[] = [];
  let seoScore = 0;
  let contentScore = 0;

  const title = input.metaTitle || input.title;
  const description = input.metaDescription || '';
  const wordCount = input.content.split(/\s+/).filter(Boolean).length;
  const minWords = input.wordCountMin ?? 300;

  if (title.length >= 30 && title.length <= 60) seoScore += 12;
  else if (title.length > 0) {
    seoScore += 6;
    issues.push('Meta title should be 30–60 characters');
  }

  if (description.length >= 120 && description.length <= 160) seoScore += 12;
  else if (description.length >= 80) seoScore += 7;
  else issues.push('Meta description should be 120–160 characters');

  if (input.hasFeaturedImage) seoScore += 8;
  else issues.push('Add a featured image for better engagement');

  if ((input.faqCount ?? 0) >= 3) seoScore += 10;
  else issues.push('Add at least 3 FAQ items for rich results');

  if ((input.internalLinkCount ?? 0) >= 3) seoScore += 8;
  else issues.push('Add at least 3 internal links');

  if (wordCount >= 800) contentScore += 20;
  else if (wordCount >= minWords) contentScore += 12;
  else issues.push(`Content needs at least ${minWords} words (currently ${wordCount})`);

  if (input.hasAuthor) contentScore += 10;
  else issues.push('Author attribution required');

  if (wordCount >= 600) contentScore += 10;
  if ((input.faqCount ?? 0) >= 5) contentScore += 10;

  const overallScore = Math.round((seoScore + contentScore) / 2);
  const grade =
    overallScore >= 85 ? 'A' : overallScore >= 70 ? 'B' : overallScore >= 55 ? 'C' : overallScore >= 40 ? 'D' : 'F';

  return {
    seoScore,
    contentScore,
    overallScore,
    grade,
    issues,
    passesAdSense: overallScore >= 70 && wordCount >= minWords && (input.hasAuthor ?? false),
  };
}
