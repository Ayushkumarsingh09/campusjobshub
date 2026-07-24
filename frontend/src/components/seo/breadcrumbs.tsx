import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { breadcrumbJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';

export interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export function Breadcrumbs({ items, className, showHome = true }: BreadcrumbsProps) {
  const allItems: BreadcrumbItem[] = showHome
    ? [{ name: 'Home', href: '/' }, ...items]
    : items;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(allItems)} />
      <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;

            return (
              <li key={item.href} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" aria-hidden />
                )}
                {isLast ? (
                  <span
                    className="font-medium text-foreground"
                    aria-current="page"
                  >
                    {index === 0 && showHome ? (
                      <span className="inline-flex items-center gap-1">
                        <Home className="h-3.5 w-3.5" aria-hidden />
                        <span className="sr-only sm:not-sr-only">{item.name}</span>
                      </span>
                    ) : (
                      item.name
                    )}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                  >
                    {index === 0 && showHome ? (
                      <>
                        <Home className="h-3.5 w-3.5" aria-hidden />
                        <span className="sr-only sm:not-sr-only">{item.name}</span>
                      </>
                    ) : (
                      item.name
                    )}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
