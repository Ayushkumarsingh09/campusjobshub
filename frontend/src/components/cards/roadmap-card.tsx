import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Clock, Layers } from 'lucide-react';
import { cn, truncate } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getRoadmapImage, resolveImageUrl } from '@/lib/images';

export interface RoadmapCardProps {
  title: string;
  slug: string;
  description?: string | null;
  level?: 'beginner' | 'intermediate' | 'advanced' | string;
  duration?: string | null;
  topicsCount?: number;
  category?: string | null;
  topic?: string | null;
  thumbnailUrl?: string | null;
  className?: string;
}

const levelVariant: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'destructive',
};

export function RoadmapCard({
  title,
  slug,
  description,
  level,
  duration,
  topicsCount,
  category,
  topic,
  thumbnailUrl,
  className,
}: RoadmapCardProps) {
  const fallback = getRoadmapImage(topic, slug);
  const src = resolveImageUrl(thumbnailUrl, fallback);

  return (
    <Card
      className={cn(
        'group overflow-hidden transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-ring',
        className
      )}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
        <Image
          src={src}
          alt={`${title} career roadmap`}
          title={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
        />
      </div>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30">
            <BookOpen className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {category && <Badge variant="outline">{category}</Badge>}
              {level && (
                <Badge variant={levelVariant[level.toLowerCase()] ?? 'secondary'}>
                  {level}
                </Badge>
              )}
            </div>
            <Link
              href={`/prepare/roadmaps/${slug}`}
              className="mt-1.5 block line-clamp-2 text-base font-semibold leading-snug transition-colors group-hover:text-primary sm:text-lg"
            >
              {title}
            </Link>
            {description && (
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {truncate(description, 100)}
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              {duration && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {duration}
                </span>
              )}
              {topicsCount !== undefined && topicsCount > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {topicsCount} topics
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
