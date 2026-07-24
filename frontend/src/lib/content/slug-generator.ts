export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 200);
}

export function generateJobSlug(title: string, company: string, city?: string): string {
  const parts = [title, company, city, String(new Date().getFullYear())].filter(Boolean);
  return slugify(parts.join(' ')).slice(0, 250);
}

export function generateBlogSlug(title: string): string {
  return slugify(title).slice(0, 250);
}

export function ensureUniqueSlug(base: string, existing: Set<string>): string {
  let slug = base;
  let i = 2;
  while (existing.has(slug)) {
    slug = `${base}-${i}`;
    i++;
  }
  existing.add(slug);
  return slug;
}
