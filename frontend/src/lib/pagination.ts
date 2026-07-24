export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | 'ellipsis')[] = [1];
  if (current > 3) pages.push('ellipsis');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('ellipsis');
  pages.push(total);
  return pages;
}

export function buildPageUrl(basePath: string, page: number, params?: Record<string, string>) {
  const search = new URLSearchParams(params);
  search.set('page', String(page));
  const qs = search.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
