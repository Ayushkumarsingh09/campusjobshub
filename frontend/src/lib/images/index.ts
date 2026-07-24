export type { ContentImageProps, ImageCategory, StockImageMeta } from './types';
export {
  STOCK_IMAGES,
  getStockImage,
  getCompanyImage,
  getJobImage,
  getInternshipImage,
  getRoadmapImage,
  getBlogImage,
} from './catalog';

import type { StockImageMeta } from './types';

/** Resolve image URL — prefer stored URL, fall back to catalog */
export function resolveImageUrl(
  storedUrl: string | null | undefined,
  fallback: StockImageMeta
): string {
  return storedUrl?.trim() || fallback.src;
}

export function resolveImageMeta(
  storedUrl: string | null | undefined,
  fallback: StockImageMeta,
  altOverride?: string
): StockImageMeta & { src: string } {
  if (storedUrl?.trim()) {
    return {
      ...fallback,
      src: storedUrl,
      alt: altOverride ?? fallback.alt,
    };
  }
  return {
    ...fallback,
    alt: altOverride ?? fallback.alt,
  };
}
