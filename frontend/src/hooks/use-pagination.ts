'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export interface UsePaginationOptions {
  paramName?: string;
  defaultPage?: number;
}

export function usePagination(options: UsePaginationOptions = {}) {
  const { paramName = 'page', defaultPage = 1 } = options;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = useMemo(() => {
    const raw = searchParams.get(paramName);
    if (!raw) return defaultPage;

    const parsed = Number.parseInt(raw, 10);
    if (!Number.isFinite(parsed) || parsed < 1) {
      return defaultPage;
    }

    return parsed;
  }, [searchParams, paramName, defaultPage]);

  const setPage = useCallback(
    (nextPage: number, replace = false) => {
      const params = new URLSearchParams(searchParams.toString());

      if (nextPage <= 1) {
        params.delete(paramName);
      } else {
        params.set(paramName, String(nextPage));
      }

      const qs = params.toString();
      const url = qs ? `${pathname}?${qs}` : pathname;

      if (replace) {
        router.replace(url);
      } else {
        router.push(url);
      }
    },
    [router, pathname, searchParams, paramName]
  );

  const buildPageHref = useCallback(
    (targetPage: number) => {
      const params = new URLSearchParams(searchParams.toString());

      if (targetPage <= 1) {
        params.delete(paramName);
      } else {
        params.set(paramName, String(targetPage));
      }

      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [pathname, searchParams, paramName]
  );

  return { page, setPage, buildPageHref, searchParams };
}
