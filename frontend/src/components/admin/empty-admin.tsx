import { Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface EmptyAdminProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyAdmin({
  title = 'No items yet',
  description = 'Get started by creating your first item.',
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyAdminProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-800 bg-zinc-900/30 px-6 py-16 text-center',
        className
      )}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800/80">
        <Inbox className="h-6 w-6 text-zinc-400" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-zinc-400">{description}</p>
      {actionLabel && (actionHref || onAction) && (
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
      )}
    </div>
  );
}
