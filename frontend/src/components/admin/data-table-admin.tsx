'use client';

import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/shared/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface AdminTableColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
  className?: string;
}

interface DataTableAdminProps<T> {
  columns: AdminTableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  loading?: boolean;
  emptyMessage?: string;
  selectable?: boolean;
  selectedIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;
  bulkActions?: React.ReactNode;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export function DataTableAdmin<T>({
  columns,
  data,
  keyExtractor,
  loading,
  emptyMessage = 'No data available',
  selectable,
  selectedIds = new Set(),
  onSelectionChange,
  bulkActions,
  page = 1,
  totalPages = 1,
  onPageChange,
  className,
}: DataTableAdminProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return data;
    return [...data].sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, columns, sortKey, sortDir]);

  const allSelected = data.length > 0 && data.every((row) => selectedIds.has(keyExtractor(row)));

  function toggleSort(key: string) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  function toggleAll(checked: boolean) {
    if (!onSelectionChange) return;
    const next = new Set(selectedIds);
    data.forEach((row) => {
      const id = keyExtractor(row);
      if (checked) next.add(id);
      else next.delete(id);
    });
    onSelectionChange(next);
  }

  function toggleRow(id: string, checked: boolean) {
    if (!onSelectionChange) return;
    const next = new Set(selectedIds);
    if (checked) next.add(id);
    else next.delete(id);
    onSelectionChange(next);
  }

  if (loading) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 px-6 py-12 text-center text-sm text-zinc-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {selectable && selectedIds.size > 0 && bulkActions && (
        <div className="flex items-center gap-3 rounded-lg border border-brand-500/30 bg-brand-500/10 px-4 py-2">
          <span className="text-sm font-medium">{selectedIds.size} selected</span>
          {bulkActions}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-zinc-800">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60">
                {selectable && (
                  <th className="w-10 px-4 py-3">
                    <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn('px-4 py-3 text-left font-medium text-zinc-400', col.className)}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 hover:text-zinc-200"
                        onClick={() => toggleSort(col.key)}
                      >
                        {col.header}
                        {sortKey === col.key ? (
                          sortDir === 'asc' ? (
                            <ArrowUp className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowDown className="h-3.5 w-3.5" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row) => {
                const id = keyExtractor(row);
                return (
                  <tr key={id} className="border-b border-zinc-800/60 transition-colors hover:bg-zinc-900/40">
                    {selectable && (
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={selectedIds.has(id)}
                          onCheckedChange={(c) => toggleRow(id, !!c)}
                          aria-label={`Select row ${id}`}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className={cn('px-4 py-3', col.className)}>
                        {col.cell(row)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {onPageChange && totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} basePath="#" onPageChange={onPageChange} />
      )}
    </div>
  );
}
