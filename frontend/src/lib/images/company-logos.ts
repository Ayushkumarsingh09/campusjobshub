/** Self-hosted company logo paths (mirrors backend seed + public/logos/) */
export function companyLogoPath(slug: string): string {
  return `/logos/${slug}.svg`;
}
