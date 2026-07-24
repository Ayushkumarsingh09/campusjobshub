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

export function uniqueSlug(base: string, suffix?: string): string {
  const slug = slugify(base);
  if (!suffix) return slug;
  return `${slug}-${suffix}`.slice(0, 250);
}
