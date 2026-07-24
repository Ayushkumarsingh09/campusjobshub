import { type LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label?: string;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  const trendDirection =
    trend === undefined ? null : trend.value > 0 ? 'up' : trend.value < 0 ? 'down' : 'neutral';

  const TrendIcon =
    trendDirection === 'up'
      ? TrendingUp
      : trendDirection === 'down'
        ? TrendingDown
        : Minus;

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight sm:text-3xl">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground sm:text-sm">{description}</p>
            )}
          </div>
          {Icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30">
              <Icon className="h-5 w-5" aria-hidden />
            </div>
          )}
        </div>
        {trend !== undefined && (
          <div
            className={cn(
              'mt-3 inline-flex items-center gap-1 text-xs font-medium sm:text-sm',
              trendDirection === 'up' && 'text-emerald-600',
              trendDirection === 'down' && 'text-destructive',
              trendDirection === 'neutral' && 'text-muted-foreground'
            )}
          >
            <TrendIcon className="h-3.5 w-3.5" aria-hidden />
            <span>
              {trend.value > 0 ? '+' : ''}
              {trend.value}%
            </span>
            {trend.label && (
              <span className="text-muted-foreground">{trend.label}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
