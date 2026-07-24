import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  children?: React.ReactNode;
}

export function AdminPageHeader({
  title,
  description,
  actionLabel,
  actionHref,
  children,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-50">{title}</h1>
        {description && <p className="text-sm text-zinc-400">{description}</p>}
      </div>
      <div className="flex items-center gap-2">
        {children}
        {actionLabel && actionHref && (
          <Button variant="brand" asChild>
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
