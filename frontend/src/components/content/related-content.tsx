import Link from 'next/link';
import { fetchRelatedContent, relatedTypeLabel } from '@/lib/content/related-content';
import type { RelatedContentType } from '@/lib/content/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RelatedContentProps {
  type: RelatedContentType;
  slug: string;
  title?: string;
  limit?: number;
}

export async function RelatedContent({
  type,
  slug,
  title = 'You may also like',
  limit = 6,
}: RelatedContentProps) {
  const items = await fetchRelatedContent(type, slug, limit);
  if (!items.length) return null;

  return (
    <section className="mt-12" aria-labelledby="related-content-heading">
      <h2 id="related-content-heading" className="text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <Card key={item.href} className="transition-colors hover:border-primary/40">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-2">
                <Badge variant="secondary" className="shrink-0 text-xs">
                  {relatedTypeLabel(item.type)}
                </Badge>
                {item.meta && (
                  <span className="text-xs text-muted-foreground">{item.meta}</span>
                )}
              </div>
              <Link href={item.href} className="mt-3 block font-medium hover:text-primary">
                {item.title}
              </Link>
              {item.excerpt && (
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.excerpt}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
