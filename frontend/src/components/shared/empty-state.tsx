import Link from 'next/link';
import { SearchX, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
  children,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 px-6 py-12 text-center sm:py-16',
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Icon className="h-7 w-7 text-muted-foreground" aria-hidden />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {children}
      {(actionLabel && actionHref) || onAction ? (
        <div className="mt-6">
          {actionHref ? (
            <Button variant="brand" asChild>
              <Link href={actionHref}>{actionLabel}</Link>
            </Button>
          ) : (
            <Button variant="brand" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
