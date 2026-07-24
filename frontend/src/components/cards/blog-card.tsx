import Link from 'next/link';
import Image from 'next/image';
import { Clock, User } from 'lucide-react';
import { cn, timeAgo, truncate } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getBlogImage, resolveImageUrl } from '@/lib/images';

export interface BlogCardProps {
  title: string;
  slug: string;
  excerpt?: string | null;
  author: string;
  publishedAt: string | Date;
  category?: string | null;
  categorySlug?: string | null;
  readingTime?: number | null;
  imageUrl?: string | null;
  className?: string;
}

export function BlogCard({
  title,
  slug,
  excerpt,
  author,
  publishedAt,
  category,
  categorySlug,
  readingTime,
  imageUrl,
  className,
}: BlogCardProps) {
  const fallback = getBlogImage(slug, categorySlug ?? undefined);
  const src = resolveImageUrl(imageUrl, fallback);

  return (
    <Card
      className={cn(
        'group overflow-hidden transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-ring',
        className
      )}
    >
      <Link href={`/blog/${slug}`} className="block">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
          <Image
            src={src}
            alt={`${title} — featured image`}
            title={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
        </div>
        <CardContent className="p-4 sm:p-5">
          {category && (
            <Badge variant="secondary" className="mb-2">
              {category}
            </Badge>
          )}
          <h3 className="line-clamp-2 text-base font-semibold leading-snug transition-colors group-hover:text-primary sm:text-lg">
            {title}
          </h3>
          {excerpt && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {truncate(excerpt, 120)}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground sm:text-sm">
            <span className="inline-flex items-center gap-1">
              <User className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {author}
            </span>
            <span>{timeAgo(publishedAt)}</span>
            {readingTime && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {readingTime} min read
              </span>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
