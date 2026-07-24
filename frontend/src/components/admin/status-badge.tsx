import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ContentStatus, ListingStatus } from '@/types/api';

type Status = ListingStatus | ContentStatus | string;

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
  pending_review: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  published: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  closed: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  expired: 'bg-red-500/15 text-red-400 border-red-500/30',
  archived: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  active_subscriber: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  unsubscribed: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  bounced: 'bg-red-500/15 text-red-400 border-red-500/30',
};

const STATUS_LABELS: Record<string, string> = {
  pending_review: 'Pending Review',
  active_subscriber: 'Active',
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const label = STATUS_LABELS[status] ?? status.replace(/_/g, ' ');
  const style = STATUS_STYLES[status] ?? 'bg-muted text-muted-foreground';

  return (
    <Badge variant="outline" className={cn('capitalize border', style, className)}>
      {label}
    </Badge>
  );
}
