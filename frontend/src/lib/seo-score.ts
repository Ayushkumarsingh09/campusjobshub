interface SeoInput {
  metaTitle?: string | null;
  metaDescription?: string | null;
  title?: string;
  description?: string;
  content?: string;
  ogImage?: string | null;
  canonicalUrl?: string | null;
}

export function calculateSeoScore(input: SeoInput): number {
  let score = 0;

  const title = input.metaTitle || input.title || '';
  const description =
    input.metaDescription || input.description || input.content?.slice(0, 160) || '';

  if (title.length >= 30 && title.length <= 60) score += 20;
  else if (title.length > 0) score += 10;

  if (description.length >= 120 && description.length <= 160) score += 20;
  else if (description.length >= 80) score += 12;
  else if (description.length > 0) score += 5;

  if (input.ogImage) score += 15;
  if (input.canonicalUrl) score += 10;

  const wordCount = (input.content || '').split(/\s+/).filter(Boolean).length;
  if (wordCount >= 800) score += 20;
  else if (wordCount >= 300) score += 12;
  else if (wordCount >= 100) score += 5;

  if (title && description && !description.includes(title.slice(0, 20))) score += 5;

  return Math.min(100, score);
}
