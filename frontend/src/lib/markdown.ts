import { marked } from 'marked';

marked.setOptions({
  gfm: true,
  breaks: true,
});

function looksLikeHtml(content: string): boolean {
  const trimmed = content.trim();
  return /^<[a-z][\s\S]*>/i.test(trimmed);
}

/** Render CMS content — supports Markdown (seed) and HTML (admin editor). */
export function renderContent(content: string): string {
  if (!content?.trim()) return '';
  if (looksLikeHtml(content)) return content;
  return marked.parse(content) as string;
}
