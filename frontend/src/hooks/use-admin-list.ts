'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ApiResponse } from '@/lib/api';
import type { PaginationMeta } from '@/types/api';

type ListFetcher<T> = (params: Record<string, string | number | boolean | undefined>) => Promise<ApiResponse<T[]>>;

export function useAdminList<T>(fetcher: ListFetcher<T>, params: Record<string, string | number | boolean | undefined> = {}) {
  const [data, setData] = useState<T[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetcher({ ...params, page, limit: 20 });
      setData(res.data ?? []);
      setMeta(res.meta ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [fetcher, params, page]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    data,
    meta,
    loading,
    error,
    page,
    setPage,
    reload: load,
  };
}
