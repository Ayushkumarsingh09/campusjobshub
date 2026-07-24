import { api, type ApiResponse } from '@/lib/api';

const RETRY_DELAYS_MS = [0, 2000, 5000];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Fetch with retries — critical for static export builds when Render API is cold-starting. */
export async function fetchWithRetry<T>(
  fetcher: () => Promise<ApiResponse<T>>,
  attempts = 3
): Promise<T | null> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    if (RETRY_DELAYS_MS[i]) await sleep(RETRY_DELAYS_MS[i]);
    try {
      const res = await fetcher();
      if (res.data !== undefined && res.data !== null) {
        return res.data;
      }
    } catch (err) {
      lastError = err;
    }
  }
  if (process.env.NODE_ENV === 'development' && lastError) {
    console.warn('[fetch-content] API unavailable, using fallbacks if provided', lastError);
  }
  return null;
}

export async function fetchListWithFallback<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined>,
  fallback: T[]
): Promise<T[]> {
  const data = await fetchWithRetry<T[]>(() => api.get<T[]>(path, params));
  return data && (Array.isArray(data) ? data.length > 0 : true) ? (data as T[]) : fallback;
}

export async function fetchOneWithFallback<T>(
  path: string,
  slug: string,
  fallbackFn: (slug: string) => T | null
): Promise<T | null> {
  const data = await fetchWithRetry<T>(() => api.get<T>(path));
  return data ?? fallbackFn(slug);
}
