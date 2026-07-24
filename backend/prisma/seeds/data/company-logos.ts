/** Self-hosted logo paths — served from frontend/public/logos/ (not hotlinked) */
export function companyLogoPath(slug: string): string {
  return `/logos/${slug}.svg`;
}
