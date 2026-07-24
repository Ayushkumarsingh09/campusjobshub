import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatItem {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: string;
}

interface StatsGridProps {
  stats: StatItem[];
  className?: string;
  loading?: boolean;
}

export function StatsGrid({ stats, className, loading }: StatsGridProps) {
  if (loading) {
    return (
      <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-lg border border-zinc-800 bg-zinc-900/50" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-lg border border-zinc-800/80 bg-zinc-900/50 p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-medium text-zinc-400">{stat.title}</p>
              <p className="text-2xl font-bold tracking-tight text-zinc-50">{stat.value}</p>
              {stat.description && (
                <p className="text-xs text-zinc-500">{stat.description}</p>
              )}
              {stat.trend && <p className="text-xs text-emerald-400">{stat.trend}</p>}
            </div>
            {stat.icon && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300">
                <stat.icon className="h-5 w-5" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
