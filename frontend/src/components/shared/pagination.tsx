'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPageNumbers, buildPageUrl } from '@/lib/pagination';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  page: number;
  totalPages: number;
  basePath: string;
  params?: Record<string, string>;
  className?: string;
  onPageChange?: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  basePath,
  params,
  className,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  function renderPageLink(pageNum: number, label: string, isActive: boolean) {
    const href = buildPageUrl(basePath, pageNum, params);

    if (onPageChange) {
      return (
        <Button
          key={pageNum}
          variant={isActive ? 'default' : 'outline'}
          size="icon"
          className="h-9 w-9"
          onClick={() => onPageChange(pageNum)}
          aria-label={`Page ${label}`}
          aria-current={isActive ? 'page' : undefined}
        >
          {label}
        </Button>
      );
    }

    return (
      <Button
        key={pageNum}
        variant={isActive ? 'default' : 'outline'}
        size="icon"
        className="h-9 w-9"
        asChild
        aria-current={isActive ? 'page' : undefined}
      >
        <Link href={href} aria-label={`Page ${label}`}>
          {label}
        </Link>
      </Button>
    );
  }

  const prevHref = buildPageUrl(basePath, page - 1, params);
  const nextHref = buildPageUrl(basePath, page + 1, params);

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-1', className)}
    >
      {page > 1 ? (
        onPageChange ? (
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline" size="icon" className="h-9 w-9" asChild>
            <Link href={prevHref} aria-label="Previous page">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
        )
      ) : (
        <Button variant="outline" size="icon" className="h-9 w-9" disabled aria-hidden>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <span
              key={`ellipsis-${i}`}
              className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground"
              aria-hidden
            >
              …
            </span>
          ) : (
            renderPageLink(p, String(p), p === page)
          )
        )}
      </div>

      {page < totalPages ? (
        onPageChange ? (
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => onPageChange(page + 1)}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline" size="icon" className="h-9 w-9" asChild>
            <Link href={nextHref} aria-label="Next page">
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        )
      ) : (
        <Button variant="outline" size="icon" className="h-9 w-9" disabled aria-hidden>
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </nav>
  );
}
